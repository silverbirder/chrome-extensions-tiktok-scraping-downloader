import { LitElement, html } from 'lit';
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"

export class WcFirestore extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
    };
  }
  constructor() {
    super();
    const firebaseApp = initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    this.data = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "collection"));
    const docs = querySnapshot.docs.filter((d) => d.data().video);
    const data = await Promise.all(docs.map(async (d) => {
      const data = d.data();
      const tiktokUrl = `https://www.tiktok.com/@${data.author}/video/${data.video.id}`;
      const tiktokOembedUrl = `https://www.tiktok.com/oembed?url=${tiktokUrl}`;
      return (await fetch(tiktokOembedUrl)).json();
    }));
    this.data = data;
  }

  render() {
    return html`<iframe srcdoc='${this.data.map((d) => d.html).join('')}' loading="lazy" width="605px" height="${739 * this.data.length}px"></iframe>`;
    // return html`${this.data.map((d) => {
    //   return html `<iframe srcdoc='${d.html}' loading="lazy" width="605px" height="739px"></iframe>`;
    // })}`;
  }
}
