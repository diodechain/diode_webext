const test = require('tape');
const Crypto = require('../src/background/crypto');

test('Test crypto module in background', async (t) => {
  let crypto = new Crypto();
  t.notOk(crypto.secp256k1_initialized);
  t.notOk(crypto.keccakTiny_initialized);

  await crypto.init();

  t.ok(crypto.secp256k1_initialized);
  t.ok(crypto.keccakTiny_initialized);

  t.test('destroy', (st) => {
    crypto.destroy();
    st.notOk(crypto.secp256k1_initialized);
    st.notOk(crypto.keccakTiny_initialized);
    st.end();
  });
  t.end();
});