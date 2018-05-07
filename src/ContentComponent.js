class ContentComponent {
  constructor() {
    this.element = document.createElement('content-component');
  }

  showMarkDown(markdownText) {
    const reader = new commonmark.Parser();
    const ast = reader.parse(markdownText);
    const writer = new commonmark.HtmlRenderer();
    const result = writer.render(ast);
    this.element.innerHTML = result;
    this.element.scrollTop = 0;
  }

  showElements(elements) {
    this.element.innerHTML = '';
    this.element.scrollTop = 0;
    this._renderElements(null, elements);
  }

  showAPIClass(apiClass) {
    this.element.innerHTML = '';
    this.element.scrollTop = 0;

    this._insertBox().appendChild(apiClass.element);

    this._renderElements('Events', apiClass.events.map(e => e.element));
    this._renderElements('NameSpaces', apiClass.namespaces.map(ns => ns.element));
    this._renderElements('Methods', apiClass.methods.map(method => method.element));
  }

  showAPIMethod(apiMethod) {
    this.showAPIClass(apiMethod.apiClass);
    this._scrollToAPIEntry(apiMethod);
  }

  showAPIEvent(apiEvent) {
    this.showAPIClass(apiEvent.apiClass);
    this._scrollToAPIEntry(apiEvent);
  }

  showAPINamespace(apiNamespace) {
    this.showAPIClass(apiNamespace.apiClass);
    this._scrollToAPIEntry(apiNamespace);
  }

  _scrollToAPIEntry(entry) {
    if (entry.element.previousSibling && entry.element.previousSibling.tagName === 'CONTENT-DELIMETER') {
      entry.element.previousSibling.scrollIntoView();
      return;
    }
    let parentBox = entry.element;
    while (parentBox && parentBox.tagName !== 'CONTENT-BOX')
      parentBox = parentBox.parentElement;
    parentBox.scrollIntoView();
  }

  _insertBox() {
    const box = document.createElement('content-box');
    this.element.appendChild(box);
    return box;
  }

  _insertDelimeter(container) {
    const delimeter = document.createElement('content-delimeter');
    container.appendChild(delimeter);
    return delimeter;
  }

  _renderElements(title, elements) {
    if (!elements.length)
      return;
    if (title) {
      const header = document.createElement('h3');
      header.textContent = title;
      this.element.appendChild(header);
    }
    const box = this._insertBox();
    let lastDelimeter = null;
    for (const element of elements) {
      box.appendChild(element);
      lastDelimeter = this._insertDelimeter(box);
    }
    lastDelimeter.remove();
  }
}
