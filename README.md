### Building `fzf` style history search with Fig

![](fzf.png)

### Overview

An often overlooked terminal shortcut is *history search*. Pressing `control`+`r`, lets you quickly search over all of your previously used terminal commands. We would like you to implement this history search functionality, similar to how it is done in [fzf](https://github.com/junegunn/fzf), but as a Fig app.



### Stack:

| Framework | Language   |
| --------- | ---------- |
| Vue       | Typescript |



### Goals:

1. Load command history from disk, accounting for different shells ( `zsh`, `fish`) and history saving formats.

   > Account for the differences in the way the shells save things to the history file (e.g. zsh can sometimes append timestamps...)

2. Live reload history file on every new line.

   > The list of commands should be updated to include any new commands run by the user.
   >
   > You should not rely on the `fig.autocomplete` hook, instead read and parse the appropriate history file (eg. `~/.zsh_history` or `~/.local/share/fish/fish_history`) directly. 

3. Handle switching between shells. 

   > For instance, if I am in a `zsh` process and then run `exec fish` the app should switch to searching over my `fish` history.

4. Display and filter a list of suggestions based on what the user has typed. Insert the selected command when the user pressed enter.

5. Implement substring/fuzzy searching and highlight matches

**Stretch Goals:**

Don't worry about this until you've finished everything the above.

-  Parse `bash` history file

- Implement virtualized scrolling to improve performance (optional)



![example](README.assets/Screen Shot 2021-05-21 at 5.07.18 PM.png)

This is an example of what the final produce might look like.

### Assessment:

1. **Code Quality**: We are looking for clean, modular code that follows Vue best practices.
2. **Robustness**: We'll be evaluating how well your parsing logic handles various history formats and shell configurations. You don't need to support everything, but do the research into the different permutations and be explicit about what you support and what you've decided is out of scope.  (If you are ever on the fence, ask us!)
3. **Product Experience**: Build something that you would want to use yourself. Leave time to polish the interface and make the interaction *feel* good. You can use Fig's existing autocomplete product as a guide.

----



### Implementation

> If you run into roadblocks, odds are this is our fault! 😅 You'll be using internal APIs that often were introduced with a very specific purpose in mind and may have strange quirks or edge cases. 
>
> **If you get stuck, *please* ask questions rather than trying to puzzle your way through Fig specific issues!**

#### Barebones Setup

1. Run `yarn install` to pull dependencies
2. Switch to development build using  `fig util:build dev`
3. Run `yarn run serve` to recompile and hot reload.



> **Notes**
>
> * When using a `dev` build, the Fig app will load a file from `localhost:3000/autocomplete/v6` in the popup window. This setup is handled by the boilerplate.
>
>   
>
> * You can switch builds by running `fig util:build <BUILD>`
>
>   * To switch to `dev`, run `fig util:build dev`. To switch back to `prod`, run `fig util:build prod`



#### Debugging Tips

- **You can right click on the popup window to force it to reload and open the web inspector.**

- If you want to force the popup window to appear (for instance, so that you can click on it to show the JS console), go to the Fig menubar icon  > Settings > Developer and then toggle "Debug Mode" on.

  > You can also run `fig settings developer.debugMode true` 

- You can press `escape` at anytime to hide the popup window. This is helpful if you need to run a command in the terminal.

- I would suggest disabling Fig in VS Code, while you are working on this challenge. You can then use the integrated terminal as your real terminal and Terminal.app or iTerm as your test environment. 

  (Currently, VSCode is the only terminal where Fig can be disabled.)

  `fig settings integrations.vscode.disabled true`

- If the some of the parameters — like `currentProcess` —  in the `fig.autocomplete` hook are coming out as `null`,  this means the Fig app has not linked the window to a shell session yet. You can fix this by running `fig source` in the terminal you are testing your app in.

- Once you're comfortable with Fig development (eg. setting window height and understanding how to debug), you could experiment with `fig settings autocomplete.onlyShowOnTab true`. **Turning this setting on will cause the Fig window to remain hidden until the user opts in by pressing tab.** 

  This interaction model more appropriate behavior for history search than the current default which is optimized for autocomplete.

---



### Relevant APIs

#### Initialization

Running fig.js commands before `fig.init` has been called results in undefined behavior. You should overwrite `fig.init` with your own function, that serves as the entry point for application logic.

```
window.fig.init = () => {
  console.log("fig.js has loaded and you can run fig commands")
  
  // you might initialize the pty here as well
  fig.pty.init()
}
```





#### Getting the Edit Buffer

This function is called on every keystroke 

```
window.fig.autocomplete = (buffer, cursorIndex, windowID, tty, currentDirectory, currentProcess) => { 

}
```
* buffer: what the user has typed on a given line
* cursorIndex: index of cursor in the line
* windowID: the macOS window ID of the terminal emulator (you won't need)
* tty: the tty of the terminal the user is in (you won't need)
* currentDirectory: the user's current working directory
* currentProcess: the full path of the currently running executable. Use this to determine whether the user is in `bash`, `zsh`, `fish` etc. Note, it could also be something like `/bin/bash` or `-zsh`





#### Intercepting Keystrokes

*While the Fig popup window is visible*, it will intercept certain keystrokes.

- Enter  (`36`)
- Tab (`48`)
- Up arrow (`126`)
- Down arrow (`125`)

**Note**: Fig will only send events for the keystrokes above, not every key stroke

```
window.fig.keypress = (appleKeyCode) => {

}
```


#### Writing Files

```
await fwrite("~/path/to/file")
```

 This will write the file at `~/path/to/file` or throw an error. It is an async wrapper over `fig.fwrite`.

#### Reading Files

```
await fread("~/path/to/file")
```

 This will read the file at `~/path/to/file` or throw an error if the file does not exist. It is an async wrapper over `fig.fread`.

###### Running Shell Commands

```
await ptyexecute("git")
```

This will execute the command in a background pseudo terminal. It is an async wrapper over `fig.pty.execute`.

> **Note:** The psuedo terminal is not guaranteed to have the same environment variables as the user's current shell.

#### Inserting Text

```
window.fig.insert("Hello there!")
```

This will insert text into the terminal on behalf of the user.

You can include special characters in the text.

- `\b` will delete a character. It is equivalent to pressing the backspace key.
- `\n` will execute whatever text is in the terminal. It is equivalent to pressing the enter key.

You can chain these special characters together.

```
window.fig.insert("\b\b\bpwd\n")
```

This would delete 3 characters from the terminal, insert then string `pwd` and then execute it.

> **Note:** Since you know the current edit buffer in the terminal from the `fig.autocomplete` hook, you can delete an entire line by taking the number of characters in the terminal and then inserting an equal number of `\b` characters.



#### Setting the Window Height

```
setWindowHeight(100)
```


#### Accessing Fig icons

See "[Fig Icon API](https://fig.io/docs/autocomplete/reference/icon-api)" for more details.

#### Accessing Fig Settings

You can access any setting value with `fig.settings["key"]`. 

- View [Settings](https://fig.io/docs/settings) for a list all key values
- Run `fig settings` to see all settings that are currently enabled.

You can access the user's default shell by running `fig.settings["userShell"]`.

