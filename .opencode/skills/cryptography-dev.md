---
description: Cryptography and security implementation for WeChat Mini Programs
mode: skill
---

**Skill Name**: Cryptography Implementation with WeChat Mini Program Support

**Expertise**: Cryptography, security, WeChat Mini Program compatibility, JavaScript/TypeScript

**Technology Stack**:

- **Primary Libraries**: crypto-js, jsencrypt
- **Prohibited**: node-forge (not compatible with WeChat Mini Programs)
- **Hash Algorithms**: MD5, SHA1, SHA256, SHA384, SHA512
- **Encryption**: AES (CBC, CTR, GCM, ECB modes)
- **Asymmetric**: RSA with jsencrypt

**Implementation Guidelines**:

1. **Library Selection**:

   - ✅ Use `crypto-js` for symmetric encryption and hashing
   - ✅ Use `jsencrypt` for RSA operations
   - ❌ Never use `node-forge` (incompatible with WeChat Mini Programs)

2. **WeChat Mini Program Compatibility**:

   - All cryptography must work in browser environment
   - No Node.js-specific APIs or dependencies
   - Test in simulated WeChat Mini Program environment

3. **Best Practices**:

   - Use appropriate key sizes (AES-256, RSA-2048+)
   - Implement proper IV/nonce generation
   - Use secure random number generation
   - Avoid hardcoded keys and secrets

4. **Common Use Cases**:
   - Password hashing (with salt)
   - Data encryption at rest
   - Secure data transmission
   - Digital signatures
   - Key generation and management

**Code Patterns for almighty-tool**:

1. **Hash Functions**:

   ```typescript
   // crypto-js pattern
   import CryptoJS from 'crypto-js';
   const hash = CryptoJS.SHA256('data').toString(CryptoJS.enc.Hex);
   ```

2. **AES Encryption**:

   ```typescript
   const encrypted = CryptoJS.AES.encrypt(data, key, {
     iv: iv,
     mode: CryptoJS.mode.CBC,
     padding: CryptoJS.pad.Pkcs7,
   });
   ```

3. **RSA Operations**:
   ```typescript
   import JSEncrypt from 'jsencrypt';
   const jsEncrypt = new JSEncrypt();
   jsEncrypt.setPublicKey(publicKey);
   const encrypted = jsEncrypt.encrypt(data);
   ```

**Testing Requirements**:

- All crypto operations must be tested with `bun test`
- Verify compatibility with existing test cases
- Test edge cases (empty strings, null values, large data)
- Ensure deterministic output for same inputs

**Security Considerations**:

- Never log sensitive data (keys, passwords, plaintext)
- Use proper error handling for crypto failures
- Validate input data before crypto operations
- Follow cryptographic best practices

**File Locations in Project**:

- Main crypto utility: `src/utils/crypto.util.ts`
- Test file: `tests/unit/utils/crypto.util.spec.ts`
- Dependencies: `package.json` (crypto-js, jsencrypt)

**Common Issues to Avoid**:

- Using deprecated algorithms (MD5 for passwords)
- Weak key sizes (AES-128, RSA-1024)
- Hardcoded keys or passwords
- Incorrect IV/nonce usage
- Missing error handling

**Success Criteria**:

- Crypto utility works correctly in browser environment
- All tests pass for crypto operations
- No Node.js-specific dependencies
- Proper error handling and validation
- Follows existing code patterns in crypto.util.ts
