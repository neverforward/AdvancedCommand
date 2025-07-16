// ©2025 neverforward. All rights reserved.

import * as mcui from '@minecraft/server-ui'
import * as mc from '@minecraft/server'

import { sys } from 'type'

import { sdo, sdofunc } from 'cmd/sdo'
import { give, givefunc } from 'cmd/give'
import { log, logfunc } from 'cmd/log'
import { warn, warnfunc } from "cmd/warn"
import { err, errfunc } from "cmd/err"
import { gm, gmfunc, gmtype } from "cmd/gm"
import { health, healthfunc } from 'cmd/health'
import { pi, pifunc } from "cmd/pi"
import { player_event, playereventfunc, actiontype } from "cmd/player_event"
import { selected_slot, selected_slotfunc } from "cmd/selected_slot"
import { name_tag, name_tagfunc } from "cmd/name_tag"
import { cl, clfunc } from "cmd/cl"
import { invis, invisfunc } from "cmd/invisible"
import { rtstat, rtstatfunc } from 'cmd/rtstat'
import { addonstat, addonstatfunc } from 'cmd/addonstat'
import { fmt_str } from 'func'

sys.beforeEvents.startup.subscribe((e) => {
  let cmdreg = e.customCommandRegistry;

  cmdreg.registerEnum('ac:gm', gmtype);
  cmdreg.registerEnum('ac:action', actiontype);

  cmdreg.registerCommand(sdo, sdofunc);
  cmdreg.registerCommand(give, givefunc)
  cmdreg.registerCommand(log, logfunc);
  cmdreg.registerCommand(warn, warnfunc);
  cmdreg.registerCommand(err, errfunc);
  cmdreg.registerCommand(gm, gmfunc);
  cmdreg.registerCommand(pi, pifunc);
  cmdreg.registerCommand(health, healthfunc);
  cmdreg.registerCommand(player_event, playereventfunc);
  cmdreg.registerCommand(selected_slot, selected_slotfunc)
  cmdreg.registerCommand(name_tag, name_tagfunc)
  cmdreg.registerCommand(cl, clfunc);
  cmdreg.registerCommand(invis, invisfunc);
  cmdreg.registerCommand(rtstat, rtstatfunc);
  cmdreg.registerCommand(addonstat, addonstatfunc);

  // cmdreg.registerCommand({ name: 'ac:raw_test', description: '', permissionLevel: 0, optionalParameters: [{ name: 'text', type: mc.CustomCommandParamType.String }] }, (o: mc.CustomCommandOrigin, str: string) => {
  //   if (o.sourceEntity instanceof mc.Player)
  //     mc.world.sendMessage(fmt_str(str, {p:o.sourceEntity}).raw);

  //   return {
  //     status: 1
  //   }
  // })
})