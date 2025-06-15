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

export let err: cmdtype = {
  name: "ac:err",
  description: "在控制台中打印错误",
  permissionLevel: perlvl.GameDirectors,
  mandatoryParameters: [
    {
      name: "message",
      type: argtype.String
    }
  ]
}

export function errfunc(o: cmdorigin, msg: string) {
  console.error(msg);
  return {
    status: statutype.Success,
    message: "错误打印成功"
  }
}