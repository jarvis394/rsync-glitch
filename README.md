# rsync-glitch

_Copies contents of your project to the external server 🚀_

---

Have an external server but do not have an access to a professional code editor?
Try using free [Glitch.com](https://glitch.com) platform as not hosting but a code editor in your browser!

## Usage

It is good to use `rsync-glitch` when:

- you don't have an access to an editor but still want to program your app which runs on an external server
- the Glitch does not provide you enough of RAM memory and you want to use your own server
- `code-server` package is an overkill for your current needs
- you are just curious what does this package!

> I can run my own VSCode in the web! Why should I use this? 🤷‍♂️

`code-server` could be the thing you've been searching for, but it takes up to **500mb of RAM**,
when you can do all the same in the Glitch's editor with `rsync-glitch` package.

---

**Step One: Install**

To install this package you have to run

```bash
npm install -D rsync-glitch

# or

yarn install -dev rsync-glitch
```

Command above will add the development dependency to your `package.json` file.

> **Wait, package.json? I'm not using Node.JS at all! What should I do?**

Don't panic, every Glitch's project container has `node` preinstalled, so simply skip this step and
go to the next one!

**Step Two: Set up the script**

Change the `"start"` script in your `package.json` file:

```json
{
  "scripts": {
-   "start": "node ."
+   "start": "rsync-glitch -s ./ -d user@server:22/app"
  }
}
```

What we are doing here:

1. Executing the package `rsync-glitch`
2. `-s` flag means the source folder where `rsync` would search for files to copy
3. `-d` flag means the destination place where `rsync` would copy the files

**Step Three (optional): Update .env**

If you have a password for the _user_ rsync would connect to by SSH, you have to create RSA keys to have secured
and automated connection.



**Step Four: Code!**

Now you can code freely and the changes you make would reflect on the server's contents!

## Arguments

|          Name           | Description                                                         | Default | Required |
| :---------------------: | ------------------------------------------------------------------- | :-----: | :------: |
|   -s, --source [path]   | Source folder rsync would copy from                                 |  "./"   |          |
|    -d, --dest <path>    | Destination address rsync would copy to                             |         |    ✔     |
|   -l, --listen [port]   | Listen on port to make Glitch project stop showing \'loading\' icon |  3000   |          |
| -t, --throttle <number> | Adds a delay before sending your changes to rsync                   |         |          |
