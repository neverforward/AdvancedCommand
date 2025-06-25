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

export let log: cmdtype = {
  name: "ac:log",
  description: "在控制台中打印日志",
  permissionLevel: permissions.log ?? perlvl.GameDirectors,
  mandatoryParameters: [
    {
      name: "message",
      type: argtype.String
    }
  ]
}

export function logfunc(o: cmdorigin, msg: string) {
  console.log(msg);
  return {
    status: statutype.Success,
    message: "日志打印成功"
  }
}