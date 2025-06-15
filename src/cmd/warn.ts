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

export let warn: cmdtype = {
  name: "ac:warn",
  description: "在控制台中打印警告",
  permissionLevel: perlvl.GameDirectors,
  mandatoryParameters: [
    {
      name: "message",
      type: argtype.String
    }
  ]
}

export function warnfunc(o: cmdorigin, msg: string) {
  console.warn(msg);
  return {
    status: statutype.Success,
    message: "警告打印成功"
  }
}