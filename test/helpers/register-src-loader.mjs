// Registers the src/ module hooks in the main thread. Kept separate from
// src-loader.mjs because `--import` needs a module that runs register(),
// while the hooks themselves are loaded into their own thread.
import { register } from 'node:module';

register('./src-loader.mjs', import.meta.url);
