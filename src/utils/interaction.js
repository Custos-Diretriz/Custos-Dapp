import {
  UseReadContractData,
  UseWriteToContract,
} from "../utils/fetchcontract";
import { stringToByteArray, byteArrayToString } from "../utils/serializer";

export async function storeCID(cid) {
  try {
    const { writeToContract } = UseWriteToContract();
    const byteArrayCID = stringToByteArray(cid);
    return await writeToContract("shield", "store_cid", [byteArrayCID]);
  } catch (error) {
    console.error("Error storing CID on Starknet:", error);
    return null;
  }
}

export async function storeBatchCIDs(cids) {
  try {
    const { writeToContract } = UseWriteToContract();
    const byteArrayCIDs = cids.map((cid) => stringToByteArray(cid));
    return await writeToContract("shield", "batch_upload_cid", [byteArrayCIDs]);
  } catch (error) {
    console.error("Error storing batch CIDs on Starknet:", error);
    return null;
  }
}

export async function getStoredCIDs() {
  try {
    const { fetchData } = UseReadContractData();
    const byteArrayCIDs = await fetchData("shield", "get_cid");
    return byteArrayCIDs.map(byteArrayToString);
  } catch (error) {
    console.error("Error fetching stored CIDs:", error);
    return [];
  }
}
