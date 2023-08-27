import { injectable, inject } from 'inversify';
import { ToolGroup } from 'wax-prosemirror-core';

@injectable()
class AskAiContent extends ToolGroup {
  tools = [];
  constructor(@inject('AskAiContentTool') AskAiContentTool) {
    super();
    this.tools = [AskAiContentTool];
  }
}

export default AskAiContent;
