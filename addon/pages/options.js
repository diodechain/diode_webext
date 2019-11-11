const diodeWebextBtn = document.querySelector("#diode-webext-option-button");
const msgBox = document.querySelector("#diode-webext-option-msgbox");

async function readSettings() {
  const storedSettings = await browser.storage.local.get()
  if (typeof storedSettings.diode !== 'undefined') {
    return storedSettings.diode;
  }
  throw new Error('cannot find the diode settings');
}

function storeSettings() {
  var newSettings = {
    nodes: [],
    certPath: '',
    privKeyPath: ''
  }
  return browser.storage.local.set({
    diode: newSettings
  });
}

function handleClick() {
  // e.preventDafault();
  // e.stopPropagation();
  storeSettings()
    .then(updateMsg.bind(this, 'Update settings successfully!', false))
    .catch(updateMsg.bind(this, 'Update settings failed!', true));
}

function updateMsg(msg, isError) {
  msgBox.textContent = msg;
  let removedClass = 'text-success';
  let addedClass = 'text-warning';
  if (!isError) {
    removedClass = 'text-warning';
    addedClass = 'text-success';
  }
  msgBox.classList.remove('hidden');
  msgBox.classList.remove(removedClass);
  msgBox.classList.add(addedClass);
}

function updateUI() {
}

function onError(e) {
  console.error(e);
}

readSettings()
  .then(updateUI)
  .catch(onError);

diodeWebextBtn.addEventListener("click", handleClick);
