import Vue from 'vue';
import App from './App.vue';
import { DOWN_ARROW_KEY, ENTER_KEY, TAB_KEY, UP_ARROW_KEY } from './common/constants';
import { setWindowHeight } from './common/fig-helpers'


declare global {
  interface Window {
    // eslint-disable-next-line
    fig: any;
  }
}



Vue.config.productionTip = false;

const vm = new Vue({
  render: (h) => h(App),
  mounted: async function () {
    console.log("Mounting component!")
    document.documentElement.setAttribute("dark", "true");
    // fig.init is called once the fig.js API has been injected into the global scope.
    window.fig.init = async () => {
      console.log("fig.js has loaded! You can now run `fig` commands.")
      window.fig.pty.init()
    }

    // Register autocomplete callback. 
    // This function is called whenever the edit buffer in the terminal is updated
    // eslint-disable-next-line
    window.fig.autocomplete = async (buffer: any, cursorIndex: any, windowID: any, tty: any, currentDirectory: any, currentProcess: any) => {
      console.group(`Autocomplete: ${buffer}`)
      if (currentProcess === null || currentProcess == undefined) {
        console.warn("Fig has not linked the window to the shell session yet.")
        console.warn("Run `fig source` in your terminal to fix.")

        await setWindowHeight(20)
        console.groupEnd()
        return
      }

      console.log(`The current edit buffer is '${buffer}' [${currentProcess}]`)

      if (!buffer || buffer.length == 0) {
        // Setting the window hieght to zero will hide the popup
        await setWindowHeight(0)
      } else {
        await setWindowHeight(200)
      }
      console.groupEnd()

    }

    // Register keypress interceptor. While the popup window is open,
    // Fig will intercept these keypresses rather than passing them to the terminal
    // eslint-disable-next-line
    window.fig.keypress = (appleKeyCode: any) => {
      console.log(`Intercepted key with code ${appleKeyCode}`);
      switch (appleKeyCode) {
        case ENTER_KEY:
          console.log("The user pressed <enter> while Fig is visible")
          break
        case TAB_KEY:
          console.log("The user pressed <tab> while Fig is visible")
          break
        case UP_ARROW_KEY:
          console.log("The user pressed the up arrow while Fig is visible")
          break
        case DOWN_ARROW_KEY:
          console.log("The user pressed the down arrow while Fig is visible")
          break
        default:
          console.log(appleKeyCode)
      }
    }


  }
}).$mount('#app');