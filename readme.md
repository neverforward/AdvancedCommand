# 高级命令 AdvancedCommand
## 简介🙃

我的世界基岩版高级命令，提供更多更强大的命令。

## 命令列表🏆

+ `cl [player:PlayerSelector]` 清除某个玩家（或自己）的背包。
+ `give <player:PlayerSelector> <itemName:string> [amount:int] [nameTag:string]` 获取物品（可获取隐藏物品，如"water"）
+ `gm<ac:gm:string> [player:PlayerSelector]` 设置某个玩家（或自己）的游戏模式。
+ `health <player:PlayerSelector> [health:int]` 查询或设置玩家的生命值。
+ `invis <enable:bool> [target:plaeyrSelector]` 使某个玩家（或自己）变成隐身。
+ `name_tag <player:PlayerSelector> [nameTag:string]` 设置或获取玩家的名称
+ `pi [player:PlayerSelector]` 显示某个玩家（或自己）的信息。
+ `player_event <player:PlayerSelector> <ac:action:string> [true_block:pos] [false_block:pos] [delay:int]` 判断玩家的活动
+ `sdo <command:string>` 以SAPI的权限执行命令（可运行任何命令，如“agent”等）
+ `selected_slot <player:PlayerSelector> [slot:int]` 设置或获取玩家的选中物品栏槽位
+ `log <message:string>` 向控制台输出信息。
+ `warn <message:string>` 向控制台输出警告信息。
+ `err <message:string>` 向控制台输出错误信息。
+ `addonstat` 显示行为包信息。
+ `rtstat` 显示运行时信息。

## TODO✔️

- [ ] UI菜单
- [ ] 物品栏菜单
- [ ] action bar菜单
- [ ] 飞行
- [ ] 变量
- [ ] sdo 命令格式化
- [ ] 计分板信息