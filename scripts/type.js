import * as mc from '@minecraft/server';
export let w = mc.world;
export let sys = mc.system;
export const perlvl = mc.CommandPermissionLevel;
export const argtype = mc.CustomCommandParamType;
export const srctype = mc.CustomCommandSource;
export const statutype = mc.CustomCommandStatus;
export let overworld;
export let nether;
export let end;
sys.run(() => {
    overworld = w.getDimension('overworld');
    nether = w.getDimension('nether');
    end = w.getDimension('the_end');
});
