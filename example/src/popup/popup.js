import { createApp } from 'vue';
import App from './App.vue';
//aimport store from '../store'

const app = createApp(App);

// Install the store instance as a plugin
//app.use(store)

app.mount('#app');
