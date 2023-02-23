class Plugin{onload(){}onunload(){}}const apiGenerate=()=>({addToolbarLeft:()=>{console.log("add toolbar left")},addToolbarRight:()=>{console.log("add toolbar right")}});class BaseComponent{}const modules={Plugin,BaseComponent},SIYUAN_DATA_PATH=window.siyuan.config.system.dataDir,PLUGIN_FOLDER="plugins",fs$1=window.require("fs"),path$1=window.require("path"),MANIFEST="manifest.json",SCRIPT="main.js",scanPlugins=async n=>new Promise((t,o)=>{fs$1.readdir(n,(e,i)=>{if(e){o(e);return}t(i.map(s=>path$1.resolve(n,s)))})}),getFileContent=async n=>new Promise((t,o)=>{fs$1.readFile(n,(e,i)=>{if(e){o(e);return}return t(i.toString("utf8"))})}),getManifest=async n=>{const t=await getFileContent(n);try{return JSON.parse(t)}catch(o){console.error("loading manifest: "+n,o)}},getScript=async n=>await getFileContent(n),getAllPlugins=async()=>{const n=await scanPlugins(path$1.join(SIYUAN_DATA_PATH,PLUGIN_FOLDER));if(!n||!n.length){console.info("No plugin found in "+path$1.join(SIYUAN_DATA_PATH,PLUGIN_FOLDER));return}const t=[];for(const o of n){console.log("Loading plugin: "+o);const[e,i]=await Promise.all([getManifest(path$1.join(o,MANIFEST)),getScript(path$1.join(o,SCRIPT))]);t.push({...e,script:i})}return t};let components;class PluginLoader{constructor(){this.plugins=new Map}async loadAllLocalPlugins(){const n=await getAllPlugins();if(n)for(const t of n)await this.loadPlugin(t)}async loadPlugin(plugin){components||this.generateRequiredModules();const exports={},module={exports};function run(script,name){return eval("(function anonymous(require,module,exports){".concat(script,`
})
//# sourceURL=`).concat(name,`
`))}const __require=n=>{if(components[n])return components[n];throw new Error(`module ${n} not found`)},pluginName=plugin.name;run(plugin.script,plugin.name)(__require,module,exports);let pluginConstructor;if(!(pluginConstructor=(module.exports||exports).default||module.exports))throw new Error(`Failed to load plugin ${pluginName}. No exports detected.`);const plug=new pluginConstructor;if(!(plug instanceof Plugin))throw new Error(`Failed to load plugin ${pluginName}`);plug.onload(),this.plugins.set(pluginName,plug)}async unloadPlugin(n){const t=this.plugins.get(n);t&&(await t.onunload(),this.plugins.delete(n))}generateRequiredModules(){components={siyuan:{...modules,...apiGenerate()}}}}class PluginSystem{constructor(){this.pluginLoader=new PluginLoader}init(){this.pluginLoader.loadAllLocalPlugins()}}const fs=window.require("fs"),path=window.require("path"),pluginScriptPosition=path.join(window.process.env.HOMEDRIVE,window.process.env.HOMEPATH,".siyuan","plugin.js");function saveToLocal(n,t){return new Promise((o,e)=>{const{writeFile:i}=fs,{Buffer:s}=require("buffer"),l=new Uint8Array(s.from(t));i(n,l,r=>{if(r)return e(r);o("The file has been saved!")})})}function createFile(n){return new Promise((t,o)=>{fs.mkdir(path.dirname(n),{recursive:!0},e=>{if(e)return o(e);t("Directory created successfully!")})})}async function localCacheInit(){try{fs.statSync(pluginScriptPosition);return}catch{console.info("[local.ts] Plugin system not found")}const n=window.siyuanPluginScript;n&&(await createFile(pluginScriptPosition),await saveToLocal(pluginScriptPosition,n))}window.pluginSystem||(console.log("Siyuan Plugin System loading..."),window.pluginSystem=new PluginSystem().init(),localCacheInit());
