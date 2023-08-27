import { Service } from 'wax-prosemirror-core';
import AskAiContent from './AskAiContent';

class AskAiContentToolGroupService extends Service {
  register() {
    this.container.bind('AskAiContent').to(AskAiContent);
  }
}

export default AskAiContentToolGroupService;
