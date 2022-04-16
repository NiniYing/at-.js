// 添加评论 输入框
import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'antd-mobile';
import './index.less';
import AtFunction from './AtFunction';

const AddComment = props => {
  const inputRef = useRef();
  const [comment, setComment] = useState(''); // input 框 value
  const [atListVisible, setAtListVisible] = useState(false); // @弹框是否出现
  const [inputItemDisabled, setInputItemDisabled] = useState(false); // 抽屉弹出input Disabled 不然就依然可以输入值
  const [atUsers, setAtUsers] = useState([]); // @人员列表
  const [inputCursonPosStart, setInputCursonPosStart] = useState(); // 光标开始位置
  const [inputCursonPosEnd, setInputCursonPosEnd] = useState(); // 光标结束位置

  useEffect(() => {
    if (comment) {
      inputRef.current.focus();
    }
  }, [comment]);
  // @和人名要作为一个整体，删除的时候要把@和人一起删除
  // Input框改变
  const handleInputChange = event => {
    const inputDom = document.getElementById('add-comment-input-item-box');
    const val = event.target && event.target.value;
    setComment(val);
    // 输入判断
    // 如果event.nativeEvent.data为@那么就知道输入的是@ ，就可以弹出抽屉
    const char = event.nativeEvent.data;
    // 如果输入的是中文@就弹窗，否则不弹窗 跟随 微信规则
    // this.isComEnd 这个条件先去掉，因为电脑端就都不弹了 char === '@' && 
    if (char === '@') {
      setAtListVisible(true);
      if (inputDom.selectionStart || inputDom.selectionStart == '0') {
        const startPos = inputDom.selectionStart;
        //得到光标后的位置
        const endPos = inputDom.selectionEnd;
        setInputCursonPosStart(startPos);
        setInputCursonPosEnd(endPos);
      }
    }
    // 删除判断
    if (comment.length - val.length === 1) { //说明是删除
      // 找到光标位置可能是复制，所以使用光标后的位置endPos，然后截取0到光标的字符串a，省的字符串为b, 然后判断atUsers[i].custName 是不是在a的末尾，
      // 是的话就从a里删除，然后把剩的字符和b拼一起，重新setComment
      if (inputDom.selectionStart || inputDom.selectionStart == '0') {
        const startPos = inputDom.selectionStart;
        //得到光标后的位置
        const endPos = inputDom.selectionEnd;
        const a = comment.substring(0, endPos + 1);
        const b = comment.substring(endPos + 1, comment.length);
        for (let i = 0; i < atUsers.length; i++) {
          const d = a.length - atUsers[i].custName.length;
          if (d >= 0 && a.lastIndexOf(atUsers[i].custName) === d) {
            // 把@xxx从input和 atUsers里删除
            const newText = a.substring(0, d);
            setComment(newText + b);
            const newAtUsers = [...atUsers];
            newAtUsers.splice(i, 1);
            setAtUsers(newAtUsers);
            // 删除后光标位置总是又回到了最后，所以需要重新设置光标位置
            setTimeout(() => {
              inputDom.setSelectionRange(endPos - atUsers[i].custName.length + 1, endPos - atUsers[i].custName.length + 1);
            });

          }

        }
      }
    }
  };
  // 输入框获取焦点
  const onFocusHandler = () => {
    const u = navigator.userAgent;
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    if (isIOS) return;
    setTimeout(() => {
      const commentBox = document.getElementsByClassName('add-comment')[0];
      // commentBox.style.bottom = '280px';
    }, 100);
  };
  // 输入框失去焦点
  const onBlurHandler = () => {
    const u = navigator.userAgent;
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    if (isIOS) return;
    setTimeout(() => {
      const commentBox = document.getElementsByClassName('add-comment')[0];
      commentBox.style.bottom = '0px';
    }, 100);
  };
  // 点击发送按钮
  const handleSendBtn = () => {
    let newArr = [];
    // 判断atUsers[i] 在comment里面的索引是不是 >= 0 如果是，把这个人放到新数组里，新数组存的人才是真正@的人
    for (let i = 0; i < atUsers.length; i++) {
      if (comment.indexOf(atUsers[i].custName) >= 0) {
        newArr.push(atUsers[i]);
      }
    }
    // 第一个参数是评论区内容，第二个参数是@的人员列表
    props.sendComment(comment, newArr);
    setComment('');
    setAtUsers([]);
  };
  // @@@@@@@@@@@@@—----------------------------------------------------------@@@@@@@@@@@@@@@@@@@@@@@
  // 点击单个人，关闭抽屉，并且把item加入到选中人数组里去，再把人插入到@后面
  const handleListItemClick = item => {
    const inputDom = document.getElementById('add-comment-input-item-box');
    setInputItemDisabled(false);
    setAtListVisible(false);
    inputRef.current.focus();
    setAtUsers([
      ...atUsers,
      {
        custNo: item.custNo,
        custName: `@${item.custName} `
      },
    ]);
    let value = inputRef.current.value;
    value = value.substring(0, inputCursonPosStart) + `${item.custName} ` + value.substring(inputCursonPosEnd, value.length);

    // atIndex为当前@所在的位置索引
    setComment(value);
    setTimeout(() => {
      inputDom.setSelectionRange(inputCursonPosStart + 1 + item.custName.length, inputCursonPosStart + 1 + item.custName.length);
    });
  };
  // 点击收起的Icon,关闭抽屉
  const handleCloseDrawer = () => {
    setInputItemDisabled(false);
    setAtListVisible(false);
    setTimeout(() => {
      inputRef.current.focus();
    });
  };
  // {/* textarea本身不能自适应高度 所以外层包裹容器 用div可以自适应的属性 */}
  return (
    <>

      <section>
        <div className="add-comment">
          <div className="box">
            <div className="v-textarea">
              <div className='add-comment-input-item-box'>{comment}</div>
              <textarea
                id="add-comment-input-item-box"
                className='add-comment-input-item-box'
                placeholder={'请输入点评信息，支持@功能'}
                value={comment}
                onChange={event => handleInputChange(event)}
                onFocus={() => onFocusHandler()}
                onBlur={() => onBlurHandler()}
                disabled={inputItemDisabled}
                ref={inputRef}
                autoComplete="off"
              />
            </div>
            <Button onClick={() => handleSendBtn()}>发送</Button>
          </div>
        </div>
      </section>
      {atListVisible && <AtFunction
        atListVisible={atListVisible}
        handleListItemClick={handleListItemClick}
        handleCloseDrawer={handleCloseDrawer}
        setInputItemDisabled={setInputItemDisabled}
      />}
    </>
  );
};
export default AddComment;
