export interface AgreementApi {
  id?: number;
  agreementType?: string;
  content: string;
  email?: string;
  first_party_country?: string;
  first_party_id_type?: string;
  first_party_valid_id?: string;
  first_party_signature?: string;
  first_party_address?: string;
  second_party_address?: string;
  second_party_country?: string;
  second_party_id_type?: string;
  second_party_valid_id?: string;
  second_party_signature?: string;
  created_at?: string;
  access_token?: string;
}

export interface AgreementOnchain {
  agreementType: string;
  content: string;
  first_party_address: string;
  second_party_address: string;
  first_party_valid_id?: string;
  second_party_valid_id?: string;
  created_at: string;
}

export type Agreement = AgreementApi | AgreementOnchain;

export interface AgreementSlugParams {
  params: { slug?: string[]; agreementAccessToken?: string };
}

