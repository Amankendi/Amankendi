import fs from "node:fs";

const registry=JSON.parse(fs.readFileSync("config/project-registry.json","utf8"));
const errors=[];
const repos=new Set();
const projectOwners=new Map();
const resourceOwners=new Map();
const shared=new Set((registry.approved_shared_resources||[]).map(x=>x.id));

for(const item of registry.repositories||[]){
  if(repos.has(item.repository)) errors.push("Duplicate repository: "+item.repository);
  repos.add(item.repository);

  if(item.classification==="verified"){
    if(!item.project_id) errors.push("Verified repository missing project_id: "+item.repository);
    if(item.role.endsWith("system_of_record")){
      const prior=projectOwners.get(item.project_id);
      if(prior && prior!==item.repository) errors.push("Multiple system-of-record repositories for "+item.project_id+": "+prior+" and "+item.repository);
      projectOwners.set(item.project_id,item.repository);
    }
  }

  for(const resource of item.resources||[]){
    if(!resource.id) { errors.push("Resource without id in "+item.repository); continue; }
    if(shared.has(resource.id)) continue;
    const prior=resourceOwners.get(resource.id);
    if(prior && prior!==item.repository) errors.push("Unapproved shared resource "+resource.id+" used by "+prior+" and "+item.repository);
    resourceOwners.set(resource.id,item.repository);
  }
}

if(registry.policy!=="zero_unapproved_overlap") errors.push("Registry policy must be zero_unapproved_overlap");

if(errors.length){
  console.error("PROJECT BOUNDARY GATE FAILED\n"+errors.map(e=>" - "+e).join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({
  boundary_gate:"pass",
  repositories:repos.size,
  verified_systems_of_record:projectOwners.size,
  classification_required:(registry.repositories||[]).filter(x=>x.classification==="classification_required").length
}));
