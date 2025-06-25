import { cmdPermissions,perlvl } from "type";

/* 
命令权限等级，不建议更改，
更改后不保证能正常运行，

更改后使用`tsc`编译再进
游戏。
*/

export const permissions: cmdPermissions = {
  "addonstat":perlvl.GameDirectors,
  "cl":perlvl.Admin,
  "err":perlvl.GameDirectors,
  "give":perlvl.GameDirectors,
  "gm":perlvl.GameDirectors,
  "health":perlvl.GameDirectors,
  "invis":perlvl.Admin,
  "log":perlvl.GameDirectors,
  "name_tag":perlvl.GameDirectors,
  "pi":perlvl.GameDirectors,
  "player_event":perlvl.GameDirectors,
  "rtstat":perlvl.GameDirectors,
  "sdo":perlvl.GameDirectors,
  "selected_slot":perlvl.GameDirectors,
  "warn":perlvl.GameDirectors,
}