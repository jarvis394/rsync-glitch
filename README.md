# rsync-glitch

*Copies contents of your project to the external server 🚀*

-------

Have an external server but do not have an access to a professional code editor?
Try using free [Glitch.com](https://glitch.com) platform as not hosting but a code editor in your browser!

## Usage

It is good to use `rsync-glitch` when:
- you don't have an access to an editor but still want to program your app which runs on an external server
- the Glitch does not provide you enough of RAM memory and you want to use your own server
- `code-server` package is an overkill for your current needs
- you are just curious what does this package!

> I can run my own VSCode in the web! Why should I use this? 🤷‍♂️

`code-server` could be the thing you've been searching for, but it takes up to **500mb of RAM**, when you can do all the same in the Glitch's editor with `rsync-glitch` package.

-------

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

**Step Two: Run**

Change the `"start"` script in your `package.json` file:

```json
{
  "scripts": {
-   "start": "node ."
+   "start": "rsync-glitch --port 3000"
  }
}
```

<p style="color: red;">hxhhd</p>
<span>yxyd</span>