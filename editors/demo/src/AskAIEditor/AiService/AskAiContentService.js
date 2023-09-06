import { Service } from 'wax-prosemirror-core';
import AskAiContentTool from './AskAiContentTool';
import AskAiContentToolGroupService from './AskAiContentToolGroupService/AskAiContentToolGroupService';
import AskAiContentPlaceHolderPlugin from './plugins/AskAiContentPlaceHolderPlugin';
import './AskAiContent.css';
import AskAIOverlay from './components/AskAIOverlay';

class AskAiContentService extends Service {
  name = 'AskAiContentService';

  boot() {
    this.app.PmPlugins.add(
      'AskAiContentPlaceHolder',
      AskAiContentPlaceHolderPlugin('AskAiContentPlaceHolder'),
    );
    const createOverlay = this.container.get('CreateOverlay');
    const config = this.config;

    // Create the overlay
    createOverlay(
      AskAIOverlay,
      { config },
      {
        nodeType: '',
        markType: '',
        followCursor: false,
        selection: true,
      },
    );
  }

  register() {
    this.container.bind('AskAiContentTool').to(AskAiContentTool);
  }

  dependencies = [new AskAiContentToolGroupService()];
}

export default AskAiContentService;
