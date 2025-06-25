import * as mc from '@minecraft/server'
import {
  cmdorigin,
  srctype,
  statutype,
  cmdtype,
  perlvl,
  argtype,
  sys
} from 'type'
import { permissions } from 'permissions';

export let invis: cmdtype = {
  name: 'ac:invis',
  description: '隐身',
  permissionLevel: permissions.invis ?? perlvl.Admin,
  mandatoryParameters: [
    {
      name: 'enable',
      type: argtype.Boolean,
    }
  ],
  optionalParameters: [
    {
      name: 'target',
      type: argtype.PlayerSelector
    }
  ]
}

export function invisfunc(o: cmdorigin, e: boolean, ps?: mc.Player[]) {
  if (!ps) {
    let p = o.sourceEntity;
    sys.run(() => {
      if (e) p.addEffect('invisibility', 20000000, { amplifier: 255, showParticles: false });
      else p.removeEffect('invisibility');
    });
  }
  else {
    for (let p of ps) {
      sys.run(() => {
        if (e) p.addEffect('invisibility', 20000000, { amplifier: 255, showParticles: false });
        else p.removeEffect('invisibility');
      });
    }
  }
  return { 
    status: statutype.Success,
    message: '命令已执行'
  }
}