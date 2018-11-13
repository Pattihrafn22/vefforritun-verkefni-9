// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
* Leit að lénum á Íslandi gegnum apis.is
*/
const program = (() => {
  let domains;

  function clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function convertDate(date) {
    return date.toISOString().split('T')[0];
  }

  function loading() {
    const container = domains.querySelector('.results');
    clearContainer(container);
    const div = document.createElement('div');
    const img = document.createElement('img');
    const text = document.createElement('text');
    div.classList.add('loading');

    img.setAttribute('src', 'loading.gif');
    div.appendChild(img);

    text.appendChild(document.createTextNode('Leita að léni...'));
    div.appendChild(text);

    container.appendChild(div);
  }

  function addDomainData(dl, string, data) {
    if (data === '') return;

    const dt = document.createElement('dt');
    dt.appendChild(document.createTextNode(string));

    const dd = document.createElement('dd');
    dd.appendChild(document.createTextNode(data));

    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  function displayError(error) {
    const container = domains.querySelector('.results');
    clearContainer(container);

    container.appendChild(document.createTextNode(error));
  }

  function displayResults(domainList) {
    const container = domains.querySelector('.results');
    clearContainer(container);

    if (domainList.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }

    const [{
      domain, registered, lastChange, expires, registrantname, email, address, country,
    }] = domainList;
    const dl = document.createElement('dl');
    container.appendChild(dl);
    addDomainData(dl, 'Lén', domain);
    addDomainData(dl, 'Skráð', convertDate(new Date(registered)));
    addDomainData(dl, 'Síðast breytt', convertDate(new Date(lastChange)));
    addDomainData(dl, 'Rennur út', convertDate(new Date(expires)));
    addDomainData(dl, 'Skráningaraðili', registrantname);
    addDomainData(dl, 'Netfang', email);
    addDomainData(dl, 'Heimilisfang', address);
    addDomainData(dl, 'Land', country);
  }

  function fetchData(domain) {
    loading();
    fetch(`${API_URL}${domain}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Villa kom upp');
      })
      .then((data) => {
        displayResults(data.results);
      })
      .catch(() => {
        displayError('Villa við að sækja gögn');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');

    if (input.value.trim() === '') {
      displayError('Lén verður að vera strengur');
      input.value = '';
      return;
    }
    fetchData(input.value);
  }

  function init(_domains) {
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
