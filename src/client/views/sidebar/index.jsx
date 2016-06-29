import React from 'react';
import Tree from 'react-ui-tree';
import Menu from 'rc-menu';
import WorkingstepList from './workingstepslist';
import WorkplanList from './workplanlist';
import ToolList from './toollist';
import ToleranceList from './tolerancelist';
import ReactTooltip from 'react-tooltip';
import cadManager from '../../models/cad_manager';
let MenuItem = Menu.Item;
let scrolled=false;

export default class SidebarView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };

        let disabledView = (name) => {
          return (() => {
            this.props.cbMode("disabled");
            this.props.cbAltMenu(name);
          }).bind(this);
        };

        let self = this;
        let updateWorkingstep = (state) => {
            self.props.cbWS(state);
            return;
        };

        this.selectMenuItem = this.selectMenuItem.bind(this);

        this.props.actionManager.on('change-workingstep', updateWorkingstep);
    }

    componentDidMount(){
    }

    selectMenuItem (info) {
        this.props.cbMode(info.key);
    }

    render() {
      // TODO currently mode menu can only have two layers
      let nested = this.props.mode != "tree";

      const modeMenu = (
          <Menu onSelect={this.selectMenuItem}
                defaultSelectedKeys={[this.props.mode]}
                mode='horizontal'
                className='sidebar-menu-tabs'>
              <MenuItem key='ws' id='sidebar-menu-ws' className='ws'>Workingsteps</MenuItem>
              <MenuItem key='tree' id='sidebar-menu-tree' className='wp'>Workplan</MenuItem>
              <MenuItem key='tools' id='sidebar-menu-tools' className='tool'>Tools</MenuItem>
              <MenuItem key='tolerance' id='sidebar-menu-tolerance' className='tolerance'>Tolerances</MenuItem>
          </Menu>
      );
      if((!scrolled) && (this.props.ws > -1))
      {
        let currElem=$('#'+this.props.ws);
        if((currElem != null) && (typeof currElem != 'undefined'))
        {
          let prevElem=currElem.parent().prev()[0];
          if(typeof prevElem != 'undefined')//not the first working step
          {
            $('.m-tree').animate({
              scrollTop: currElem.offset().top-$(".m-tree").offset().top
              }, 1000);
          }
          scrolled=true;//dont want to scroll for the first working step but keep it here so we dont scroll on a rerender
        }
      }
        return <div className="sidebar">
                  {modeMenu}
                  {this.props.mode == 'ws' ?
                      <WorkingstepList cbMode = {this.props.cbMode} cbTree = {this.props.cbTree} ws = {this.props.ws}/>
                      : null}
                  {this.props.mode == 'tree' ?
                      <WorkplanList cbMode = {this.props.cbMode} cbTree = {this.props.cbTree} ws = {this.props.ws}/>
                      : null}
                  {this.props.mode == 'tolerance' ?
                      <ToleranceList cbMode = {this.props.cbMode} cbTree = {this.props.cbTree}  />
                      : null}
                  {this.props.mode == 'tools' ?
                      <ToolList cbMode = {this.props.cbMode} cbTree = {this.props.cbTree} ws = {this.props.ws}/>
                      : null}
               </div>;
    }
}

SidebarView.propTypes = {cadManager: React.PropTypes.instanceOf(cadManager).isRequired, mode : React.PropTypes.string.isRequired,
                          ws: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
                          cbMode: React.PropTypes.func.isRequired, cbTree: React.PropTypes.func.isRequired, cbWS: React.PropTypes.func.isRequired,
                          cbAltMenu: React.PropTypes.func.isRequired};
