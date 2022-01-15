import { LitElement, html } from 'lit';
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore"

export class WcFirestore extends LitElement {
  static get properties() {
    return {
      docs: { type: Array },
      oembeds: { type: Array },
    };
  }
  constructor() {
    super();
    const firebaseApp = initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    this.db = getFirestore(firebaseApp);
    this.docs = [];
    this.oembeds = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    const col = collection(this.db, 'collection');
    const q = query(col, limit(5));
    const querySnapshot = await getDocs(q);
    this.docs = querySnapshot.docs.filter((d) => d.data().video);
    this.oembeds = await Promise.all(this.docs.map(async (d) => {
      const data = d.data();
      const tiktokUrl = `https://www.tiktok.com/@${data.author}/video/${data.video.id}`;
      const tiktokOembedUrl = `https://www.tiktok.com/oembed?url=${tiktokUrl}`;
      return (await fetch(tiktokOembedUrl)).json();
    }));
  }
  async readMore() {
    const lastDoc = this.docs[this.docs.length - 1];
    const col = collection(this.db, 'collection');
    const q = query(col, limit(5), startAfter(lastDoc));
    const querySnapshot = await getDocs(q);
    const incDocs = querySnapshot.docs.filter((d) => d.data().video);
    const incOembeds = await Promise.all(incDocs.map(async (d) => {
      const data = d.data();
      const tiktokUrl = `https://www.tiktok.com/@${data.author}/video/${data.video.id}`;
      const tiktokOembedUrl = `https://www.tiktok.com/oembed?url=${tiktokUrl}`;
      return (await fetch(tiktokOembedUrl)).json();
    }));
    incDocs.map((d) => {
      this.docs.push(d);
    });
    incOembeds.map((d) => {
      this.oembeds.push(d);
    });
    this.requestUpdate();
  }
  render() {
    // In the html in the tiktok oembed return, the height is specified as 739px.
    // @see https://www.tiktok.com/oembed?url=xxxx ...

    // return html`
    //   <iframe srcdoc='${this.oembeds.map((d) => d.html).join('')}' loading="lazy" width="100%" height="${739 * this.oembeds.length}px">
    //   </iframe><button @click=${this.readMore}>Read more...</button>`;
    return html`${this.oembeds.map((d) => {
      return html `<iframe srcdoc='${d.html}' loading="lazy" width="100%" height="739px"></iframe>`;
    })}<button @click=${this.readMore}>Read more...</button>`;
  }
}
