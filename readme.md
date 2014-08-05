# [CreactJs](http://www.creactjs.org) #

Package manager for [ReactJs](http://facebook.github.io/react/) components.
Create, publish and include your [ReactJs](http://facebook.github.io/react/) components easily.

### How do I get set up? ###
Install the CreactJs package manager globally through NPM
```
$ npm install -g creactjs
```

### Creating a new module ###
CreactJs comes with a handy init function that lets you get started on your component even quicker.
```
$ creactjs init myNewModule
```
The above command will create:

- new folder called myNewModule
- creact.json manifest file
- index.jsx file, the main view for your component.

####Init options
- -s,-store : will add to your module a base store implementation
- -v,-view : if the store option is set, this will create a view together with a store
- -git repoUrl : will add to the manifest file the correct repo for your module

### Contacts ###
- contact me for any info or if you want to help contribute creactjs@gmail.com
- For any bugs, feature requests or comments please use the [Github repository](https://github.com/taddei/creactjs)