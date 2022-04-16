// @功能，输入@展示人员选择功能
import React, { useEffect, useState } from 'react';
import { SearchBar, List, Drawer, Icon } from 'antd-mobile';
import { useServiceApi } from '@/hooks';
import { qryTeamMembers } from '@/services/SecondaryTeam';
import { Warp } from '@/components';
import './index.less';
const mockList = [{
  custNo: '1111111',
  headImg: 'eewww',
  custName: '张三',
}, {
  custNo: '22222',
  headImg: 'eeeee',
  custName: '李四',
}, {
  custNo: '33333',
  headImg: 'eeeee',
  custName: '王二',
}];
const AtFunction = props => {
  const { atListVisible, handleListItemClick, handleCloseDrawer, setInputItemDisabled } = props;
  const [membersData, membersLoading, membersRequest] = useServiceApi(qryTeamMembers); // 请求团队成员数据
  const [searchMemberList, setSearchMemberList] = useState(mockList); // 选中的人员下拉列表
  useEffect(() => {
    membersRequest();
    setInputItemDisabled(true);
  }, []);

  const handleSearchBarChange = val => {
    console.log(val, 'val');
    const newSearchList = mockList.filter(item => item.custName.includes(val));
    setSearchMemberList(newSearchList);
  };
  const sidebar =
    <div className='at-function-content'>
      <div className='at-function-tips'>
        <div className='at-function-tips-text'>
          <div className='at-tips-close-icon' onClick={() => handleCloseDrawer()}>
            <Icon type="down" />
          </div>
          <div>请选择要提醒的人</div>
        </div>
        <div className='at-function-tips-search'>
          <SearchBar placeholder='搜索' onChange={handleSearchBarChange} />
        </div>
      </div>
      <div className='at-function-list'>
        <Warp loading={membersLoading}>
          <List header=''>
            {searchMemberList.map(item => {
              return <List.Item key={item.custNo} onClick={() => handleListItemClick(item)}>
                <div className='every-list-item'>
                  <img className='people-img' src={item.headImg || ''} alt="" />
                  <span>{item.custName}</span>
                </div>
              </List.Item>;
            })}
          </List>
        </Warp>

      </div>
    </div>;
  return (
    <Drawer
      open={atListVisible}
      className="at-function-my-drawer"
      sidebarStyle={{
        padding: '10px',
        height: 'calc(100% - 150px)'
      }}
      enableDragHandle
      sidebar={sidebar}
      onOpenChange={() => handleCloseDrawer()}
      position="bottom"
    >
      <div></div>
    </Drawer>
  );
};
export default AtFunction;
