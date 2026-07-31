import { createClient } from "@supabase/supabase-js";

const TABLE = "failed_anchors";

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    : null;

if (!supabase) {
  console.warn("Supabase not configured — failed anchors will not be queued.");
}

/**
 * Draft store: CIDs that reached IPFS but not the chain. Retried later,
 * so the recording isn't lost to a funding or network problem.
 */
export async function queueFailedAnchors({
  fileHashes,
  contentHashes = [],
  chainKey,
  user,
  isGuest,
  reason,
}) {
  if (!supabase) return;

  const rows = fileHashes.map((file_hash, i) => ({
    file_hash,
    content_hash: contentHashes[i] || "",
    chain_key: chainKey,
    user_address: user.toLowerCase(),
    is_guest: isGuest,
    status: "pending",
    last_error: String(reason).slice(0, 500),
  }));

  const { error } = await supabase
    .from(TABLE)
    .upsert(rows, { onConflict: "file_hash,chain_key" });

  if (error) console.error("queueFailedAnchors failed:", error);
}

export async function listPendingAnchors({ userAddress, chainKey }) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "id, file_hash, content_hash, chain_key, is_guest, attempts, last_error, created_at"
    )
    .eq("user_address", userAddress.toLowerCase())
    .eq("chain_key", chainKey)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function markAnchored({ id, txHash }) {
  if (!supabase) return;

  const { error } = await supabase
    .from(TABLE)
    .update({
      status: "anchored",
      tx_hash: txHash,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) console.error("markAnchored failed:", error);
}

export async function markRetryFailed({ id, attempts, reason }) {
  if (!supabase) return;

  const { error } = await supabase
    .from(TABLE)
    .update({
      attempts: attempts + 1,
      last_error: String(reason).slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) console.error("markRetryFailed failed:", error);
}