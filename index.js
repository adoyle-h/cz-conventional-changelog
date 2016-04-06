'use strict';

var wrap = require('word-wrap');

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = {

    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {
        var maxLineWidth = 100;
        var advice = '\n第一行建议在 ' + maxLineWidth + ' 字以内。其他行若超过 ' + maxLineWidth + ' 字会自动换行。\n';

        console.log(advice);

        // Let's ask some questions of the user
        // so that we can populate our commit
        // template.
        //
        // See inquirer.js docs for specifics.
        // You can also opt to use another input
        // collection library if you prefer.
        cz.prompt([{
            type: 'list',
            name: 'type',
            message: '选择类型',
            choices: [{
                name: 'feat:     新的功能',
                value: 'feat',
            }, {
                name: 'fix:     修复 BUG',
                value: 'fix',
            }, {
                name: 'docs:     更改文档',
                value: 'docs',
            }, {
                name: 'style:    代码风格调整（如空白符、格式、少分号等等）',
                value: 'style',
            }, {
                name: 'refactor: 重构代码（即不修复错误，也不添加新功能，不影响功能）',
                value: 'refactor',
            }, {
                name: 'perf:     提升性能的代码修改',
                value: 'perf',
            }, {
                name: 'test:     测试相关的修改',
                value: 'test',
            }, {
                name: 'chore:    构建工具的修改',
                value: 'chore',
            }],
        }, {
            type: 'input',
            name: 'scope',
            message: '编码修改的范围 (scope):\n',
        }, {
            type: 'input',
            name: 'subject',
            message: '修改内容概述:\n',
        }, {
            type: 'input',
            name: 'body',
            message: '详细描述这次的修改内容:\n',
        }, {
            type: 'input',
            name: 'breaking',
            message: 'Breaking Changes:\n',
        }, {
            type: 'input',
            name: 'footer',
            message: '相关任务或者 Issue（以 # 开头会自动 Close Issue）:\n',
        }], function(answers) {
            var wrapOptions = {
                trim: true,
                newline: '\n',
                indent: '',
                width: maxLineWidth,
            };

            // parentheses are only needed when a scope is present
            var scope = answers.scope.trim();
            scope = scope ? '(' + answers.scope.trim() + ')' : '';

            // Hard limit this line
            var head = answers.type + scope + ': ' + answers.subject.trim();

            // Wrap these lines at 100 characters
            var body = wrap(answers.body, wrapOptions);
            var breaking = wrap(answers.breaking, wrapOptions);
            var footer = wrap(answers.footer, wrapOptions);

            var msg = head;

            if (body) {
                msg += '\n\n' + body;
            }
            if (breaking) {
                msg += '\n\nBREAKING CHANGE: ' + breaking;
            }
            if (footer) {
                if (footer.startsWith('#')) {
                    msg += '\n\nCloses ' + footer;
                } else {
                    msg += '\n\n' + footer;
                }
            }
            commit(msg);
        });
    },
};
