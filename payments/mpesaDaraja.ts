import fs from 'fs';
import path from 'path';
import axios from 'axios';
import crypto from 'crypto';

export interface DarajaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passkey: string;
  initiatorPassword: string;
  certificatePath: string;
  environment: 'sandbox' | 'production';
}

export class MpesaDaraja {
  private config: DarajaConfig;
  constructor(config: DarajaConfig) {
    this.config = config;
  }

  async getAccessToken(): Promise<string> {
    const url = this.config.environment === 'production'
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
    const res = await axios.get(url, {
      headers: { Authorization: `Basic ${auth}` }
    });
    return res.data.access_token;
  }

  generateSecurityCredential(): string {
    const cert = fs.readFileSync(this.config.certificatePath);
    const buffer = Buffer.from(this.config.initiatorPassword);
    const encrypted = crypto.publicEncrypt({
      key: cert,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    return encrypted.toString('base64');
  }

  // Add more methods for B2C, C2B, etc.
}

// Example usage (in your route):
// import { MpesaDaraja, DarajaConfig } from './payments/mpesaDaraja';
// const daraja = new MpesaDaraja({ ... });
// const token = await daraja.getAccessToken();
