import {createMixin} from '../../../node_modules/polymer-redux';
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '../../css/shared-styles.js';
import '../../components/layouts/main-layout.js';
import '../../components/navigation/help-navigation.js';
import store from '../../global/store.js';
const ReduxMixin = createMixin(store);

class PageContact extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          background-color: var(--host-background-color);
          color: var(--host-color);
        }
        article h1 {
          font-size: 35px;
          font-weight: 300;
        }
        article h3 {
          font-size: 18px;
          font-weight: 300;
        }
        article {
            margin: 0 12px;
          }
        select {
          width: 300px;
        }
        .button {
          margin-left: 0px;
          background-color: var(--black1-white2);
        }
        input, select {
          background-color: var(--black1-white2);
        }
        @media screen and (min-width: 900px){
          article {
            margin: 0 12px 0 0;
          }
        } 
      </style>
  
      <main-layout> 
          <div slot="aside">
            <help-navigation></help-navigation>
          </div>
          <div slot="body">
            <article>
              <section>
                <header>
                  <h1>Contact Us</h1>
                  <p>Check out our Help Section. If you're still stumped, drop us a line.</p></br>
                  <label for="name">Enquiry type</label>
                  <select value="{{enquiry::input}}" id="enquiry">
                   <option value="">Select...</option>
                    <template is="dom-repeat" items="[[reasons]]">
                      <option value="[[item]]">[[item]]</option>
                    </template>
                  </select>
                  <small class="issue">[[issueEnquiry]]</small>

                  <label for="name">Name</label>
                  <input name="name" id="name" value="{{name::input}}">
                  <small class="issue">[[issueName]]</small>

                  <label for="Email">Email</label>
                  <input name="Email" id="email" value="{{email::input}}">
                  <small class="issue">[[issueEmail]]</small>

                  <label for="Message">Message</label>
                  <textarea rows="8" cols="50" value="{{message::input}}" id="message"></textarea>
                  <small class="issue">[[issueMessage]]</small>

                  <button class="flat-btn button" on-click="_send">[[btnText]]</button>
                </header>
              </section>
            </article>
          </div>
      </main-layout>
    `;
  }

  static get properties() {
    return {
      language: {
        type: String,
        readOnly: true,
      },
      mode: {
        type: String,
        readOnly: true,
        observer: '_mode',
      },
      env: {
        type: Array,
        readOnly: true,
        observer: '_env',
      },
      color: {
        type: Object,
        readOnly: true,
      },
      btnText: {
        type: String,
        value: 'Send Enquiry',
      },
    };
  }

  static mapStateToProps(state, element) {
    return {
      language: state.language,
      mode: state.mode,
      env: state.env,
      color: state.color,
    };
  }

  _validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  _send() {
    this.issueEnquiry = '';
    this.issueName = '';
    this.issueEmail = '';
    this.issueMessage = '';
    this.shadowRoot.querySelector('#enquiry').classList.remove('error');
    this.shadowRoot.querySelector('#name').classList.remove('error');
    this.shadowRoot.querySelector('#email').classList.remove('error');
    this.shadowRoot.querySelector('#message').classList.remove('error');
    const enquiry = this.enquiry;
    const name = this.name;
    const email = this.email;
    const message = this.message;
    const data = {enquiry, name, email, message};
    const url = `${this.env.apiUrl}/help/contact/`;
    if (enquiry && name && email && data && url) {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
      })
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            this.enquiry = '';
            this.name = '';
            this.email = '';
            this.message = '';
            this.btnText = 'sent';
            setTimeout(() => {
              this.btnText = 'Send Enquiry';
            }, 3000);
          })
          .catch((error) => console.log('Error:', error));
    } else {
      if (!enquiry) {
        this.issueEnquiry = 'Select one';
        this.shadowRoot.querySelector('#enquiry').classList.add('error');
      };
      if (!name) {
        this.issueName = 'What\'s your name';
        this.shadowRoot.querySelector('#name').classList.add('error');
      };
      if (!email) {
        this.issueEmail = 'Invalid email';
        this.shadowRoot.querySelector('#email').classList.add('error');
      };
      if (!message) {
        this.issueMessage = 'Enter a massage';
        this.shadowRoot.querySelector('#message').classList.add('error');
      };
    }
  }

  _env() {
    this.reasons = this.env.contactReasons;
  }

  _mode() {
    this.updateStyles({'--blue-color': this.color.blue});
    this.updateStyles({'--grey-color': this.color.grey});
    this.updateStyles({'--red-color': this.color.red});
    this.updateStyles({'--green-color': this.color.green});
    if (this.mode === 'light') {
      this.updateStyles({'--host-background-color': this.color.white2});
      this.updateStyles({'--host-color': this.color.black2});
      this.updateStyles({'--black1-white2': this.color.white2});
      this.updateStyles({'--black3-white3': this.color.white3});
      this.updateStyles({'--white1-black1': this.color.black1});
      this.updateStyles({'--white2-black2': this.color.black2});
      this.updateStyles({'--black3-white1': this.color.white1});
      this.updateStyles({'--black1-white2': this.color.white2});
      this.updateStyles({'--black1-white3': this.color.white3});
      this.updateStyles({'--white2-black3': this.color.black3});
      this.updateStyles({'--black2-white1': this.color.white1});
      this.updateStyles({'--black2-white3': this.color.white3});
    } else {
      this.updateStyles({'--host-background-color': this.color.black2});
      this.updateStyles({'--host-color': this.color.white1});
      this.updateStyles({'--black1-white2': this.color.black1});
      this.updateStyles({'--black3-white3': this.color.black3});
      this.updateStyles({'--white1-black1': this.color.white1});
      this.updateStyles({'--white2-black2': this.color.white2});
      this.updateStyles({'--black3-white1': this.color.black3});
      this.updateStyles({'--black1-white2': this.color.black1});
      this.updateStyles({'--black1-white3': this.color.black1});
      this.updateStyles({'--white2-black3': this.color.white2});
      this.updateStyles({'--black2-white1': this.color.black2});
      this.updateStyles({'--black2-white3': this.color.black2});
    }
  }
} window.customElements.define('page-contact', PageContact);
