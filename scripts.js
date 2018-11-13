// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});


/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;


  function addDomainData(dl, string, data) {
    const dt = document.createElement('dt');
    dt.appendChild(document.createTextNode(string));

    const dd = document.createElement('dd');
    dd.appendChild(document.createTextNode(data));

    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  function displayResults(domainList) {
    const container = domains.querySelector('.results');
    if (domainList === 0 ) {
      displayError("Lén er ekki skráð");
      return;
    }
    const [{ domain, registered, lastChange, expires, registrantname, email, address, country }] = domainList;
    const dl = document.createElement('dl');
    container.appendChild(dl);
    addDomainData(dl, "Lén", domain);
    
  }


  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }


  function fetchData(domain) {
    fetch(`${API_URL}${domain}`)
      .then((response) => {
          if (response.ok) {
            return response.json();
          }

          throw new Error('Villa kom upp');
      })
      .then((data) => {
        console.log(data);
        displayResults(data.results);
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn')
      })
  }

    function onSubmit(e) {
      e.preventDefault();
      const input = e.target.querySelector('input');

      // TODO hönda tóma streng
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


