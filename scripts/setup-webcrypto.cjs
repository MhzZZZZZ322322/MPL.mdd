const nodeCrypto = require('node:crypto');
const { webcrypto } = require('crypto');

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

if (nodeCrypto && !nodeCrypto.getRandomValues && webcrypto?.getRandomValues) {
  nodeCrypto.getRandomValues = webcrypto.getRandomValues.bind(webcrypto);
}
