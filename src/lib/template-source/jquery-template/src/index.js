

import { change, asyncChange, promiseChange } from './events';

const ${_Component} = `<div id="Vues">
    <h2>这是一个原生组件，名称：${_Component}</h2>
    <div class="text">hello world</div>
    <button class="change">同步dispatch</button>
    <Button class="async-change">异步dispatch</button>
    <Button class="promise-change">promise dispatch</button>
</div>`;

$(document).on('click', '.change', change.bind($('#Vues'))).
    on('click', '.async-change', asyncChange.bind($('#Vues'))).
    on('click', '.promise-change', promiseChange.bind($('#Vues')));

export default ${_Component};

