// Switches the suite over to the built bundle. Passed as `--import` so it runs
// before any test file, and because Node hands its execArgv down to the child
// process it spawns per test file, the setting reaches all of them.
//
// Used by `npm run test:dist`, which builds first. The default (`npm test`)
// runs the same tests against src/ and needs no build.
//
// The src-loader stays registered alongside this: unit tests of the exported
// pure functions import them from src/ either way, because index.js does not
// re-export them and they are therefore unreachable from the bundle. Testing
// them twice would prove nothing anyway - it is the same code.
process.env.TOOTHBRUSH_CARD_TARGET = 'dist';
