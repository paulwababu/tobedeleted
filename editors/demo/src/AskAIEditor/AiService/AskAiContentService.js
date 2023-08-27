import { Service } from 'wax-prosemirror-core';
import AskAiContentTool from './AskAiContentTool';
import AskAiContentToolGroupService from './AskAiContentToolGroupService/AskAiContentToolGroupService';
import AskAiContentPlaceHolderPlugin from './plugins/AskAiContentPlaceHolderPlugin';
import './AskAiContent.css';

class AskAiContentService extends Service {
  name = 'AskAiContentService';

  boot() {
    this.app.PmPlugins.add(
      'AskAiContentPlaceHolder',
      AskAiContentPlaceHolderPlugin('AskAiContentPlaceHolder'),
    );
  }

  register() {
    this.container.bind('AskAiContentTool').to(AskAiContentTool);
  }

  dependencies = [new AskAiContentToolGroupService()];
}

export default AskAiContentService;
