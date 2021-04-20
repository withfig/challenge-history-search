const fread = (path) => {
	return new Promise((resolve, reject) => {
		fig.fread(path, (data, err) => {
			if (err) return reject(err)
			resolve(data)
		})
	})
}

const fwrite = (path, data) => {
	return new Promise((resolve, reject) => {
		fig.fwrite(path, data, (err) => {
			if (err) return reject(err)
			resolve(data)
		})
	})
}

const ptyexecute = (command) => {
	return new Promise((resolve, reject) => {
		fig.pty.execute(command, (data, err) => {
			if (err) return reject(err)
			resolve(data)
		})
	})
}