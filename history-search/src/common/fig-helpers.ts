/* eslint-disable */

// The different shims that we have for doing things with fig
export const fread = (path: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        window.fig.fread(path, (data: string, err: any) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

export const fwrite = (path: any, data: unknown) => {
    return new Promise((resolve, reject) => {
        window.fig.fwrite(path, data, (err: any) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

export const ptyexecute = (command: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        window.fig.pty.execute(command, (data: string, err: any) => {
            if (err) {
                console.log(err);
                return reject(err)
            }
            resolve(data)
        })
    })
}

export const insert = (text: string) => {
    window.fig.insert(text)
}

export const setWindowHeight = (height: number): Promise<void> => {

    return new Promise((resolve, reject) => {
        console.log(`Setting height to ${height}`)
        let debugMode = window.fig.settings["developer.debugMode"]

        if (debugMode) {
            console.warn("Debug Mode is enabled. This will set the window height to a constant value.")
            console.warn("Debug Mode can be disabled by running `fig settings developer.debugMode false`")
        }

        let maxHeight = window.fig.settings["autocomplete.height"] || 140

        if (height > maxHeight) {
            console.warn(`Attempting to set height to ${height} which is greater than the user-defined max height of ${maxHeight}. `)
            console.warn('You can update the max height by running `fig settings autocomplete.height <number>`')

            height = maxHeight
        }

        window.fig.private({ type: "setAutocompleteHeight", data: { "height": `${height}` } }, () => {
            resolve()
        })
    })
}