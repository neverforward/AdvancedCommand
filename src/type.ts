import * as mc from '@minecraft/server'

export let w = mc.world
export let sys = mc.system

export type cmdtype = mc.CustomCommand;
export type cmdorigin = mc.CustomCommandOrigin;

export const perlvl = mc.CommandPermissionLevel;
export const argtype = mc.CustomCommandParamType;
export const srctype = mc.CustomCommandSource;
export const statutype = mc.CustomCommandStatus;

export let overworld: mc.Dimension;
export let nether: mc.Dimension;
export let end: mc.Dimension;

sys.run(() => {
  overworld = w.getDimension('overworld');
  nether = w.getDimension('nether');
  end = w.getDimension('the_end');
})