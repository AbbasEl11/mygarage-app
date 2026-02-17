/**
 * Storage Module
 * 
 * Provides persistent local storage using Ionic Storage.
 * Used for caching vehicle data offline.
 */

import { Storage } from '@ionic/storage';

const storage = new Storage();

export default storage;
