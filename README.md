# Lodash Import Only What You Need!

This is a quick extension that allows you to replace your lodash imports quickly and easily using indvidual module importing. This is ideal for existing projects that use lodash frequently but need to reduce bundle size.

For example this plugin will change the following code
```js
import _ from 'lodash'
lodash.filter(array1, x=>x.isEnabled)
lodash.orderBy(array1, x=>x.Name)
```
To
```js
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
filter(array1, x=>x.isEnabled)
orderBy(array1, x=>x.Name)
```

## Features

- Reduce bundle size with a single action
    - Just use the command pallet and select `Lodash Shake`
    ![Example](/images/NormalDemo.gif)
- Run when you need to.
    - You can develop importing the full lodash library and use this plugin to clean up your code after
    ![Reusability Example](/images/Reuseablility.gif)
- Handles any name
    - It doesn't matter what you importted lodash as it will work
    ![Handles Any Name Example](/images/HandlesAnyName.gif)
- Supports ES6 syntax
    - Supports `import module from` syntax from ES6



## Known Issues

- Does not support require syntax (`const _ = require('lodash')`)
- Does not support curly brace import (`import {filter} from lodash`)
- Adds new line in sometimes inappropriate places wherever `import` statements are

## Support
For support please open an issue or pull request on [github](https://github.com/pilotkid/lodash-only-import-what-you-need)

## Please also consider supporting me on ko-fi
<a href='https://ko-fi.com/marcellobachechi' target='_blank'><img height='35' style='border:0px;height:46px;' src='https://az743702.vo.msecnd.net/cdn/kofi5.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

---

## Release Notes


### 1.0.0

Initial release

---

**Enjoy!**
