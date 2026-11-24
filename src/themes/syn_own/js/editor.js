(function() {
	tinymce.PluginManager.add('synx_editor_button_plugin', function(ed, url) {
			ed.addButton('marker_btn', {
				text: 'マーカー',
				type: 'menubutton',
				menu: [
					{
						text: 'きいろ',
						onclick: function() {
							var selected_text = ed.selection.getContent() || 'マーカーしたいコンテンツ';
							ed.insertContent('<span class="synx-marker is-yellow">'+ selected_text +'</span>');
						}
					},
					{
						text: 'オレンジ',
						onclick: function() {
							var selected_text = ed.selection.getContent() || 'マーカーしたいコンテンツ';
							ed.insertContent('<span class="synx-marker is-orange">'+ selected_text +'</span>');
						}
					},
					{
						text: 'みずいろ',
						onclick: function() {
							var selected_text = ed.selection.getContent() || 'マーカーしたいコンテンツ';
							ed.insertContent('<span class="synx-marker is-sky">'+ selected_text +'</span>');
						}
					},
					{
						text: 'きみどり',
						onclick: function() {
							var selected_text = ed.selection.getContent() || 'マーカーしたいコンテンツ';
							ed.insertContent('<span class="synx-marker is-green">'+ selected_text +'</span>');
						}
					},
				]
			});
			ed.addButton('link_btn', {
				text: 'リンクスタイル',
				type: 'menubutton',
				menu: [
					{
						text: '矢印アイコン付き',
						onclick: function() {
							var selected_text = ed.selection.getContent() || 'ボタンのテキスト';
							ed.insertContent('<a href="#" class="synx-link-arrow">'+ selected_text +'</a>');
						}
					},
					{
						text: 'メインカラーグラデーション（ボタン）',
						onclick: function() {
							var selected_text = ed.selection.getContent() || 'ボタンのテキスト';
							ed.insertContent('<a href="#" class="synx-btn is-gradation">'+ selected_text +'</a>');
						}
					},
					{
						text: 'メインカラーの囲み（ボタン）',
						onclick: function() {
							var selected_text = ed.selection.getContent() || 'ボタンのテキスト';
							ed.insertContent('<a href="#" class="synx-btn is-outline">'+ selected_text +'</a>');
						}
					},
				]
			});
			ed.addButton('hukidashi_btn', {
				text: 'ふきだし',
				type: 'menubutton',
				menu: (typeof synxBalloonList !== 'undefined' ? synxBalloonList : []).map(function(item) {
					return {
						text: item.name,
						value: item.id,
						onclick: function() {
							const shortcode = '[balloon id="' + item.id + '"' + item.disp_name + ']テキストを入力…[/balloon]';
							ed.insertContent(shortcode);
						}
					};
				})
			});
			ed.addButton('column_btn', {
				text: 'カラム',
				type: 'menubutton',
				menu: [{
						text: '2カラム',
						onclick: function() {
							var selected_text = ed.selection.getContent() || '<p>コンテンツ</p><p>コンテンツ</p>';
							ed.insertContent('<div class="synx-column-2"><p>'+ selected_text +'</p></div>');
						}
					},{
						text: '3カラム',
						onclick: function() {
							var selected_text = ed.selection.getContent() || '<p>コンテンツ</p><p>コンテンツ</p><p>コンテンツ</p>';
							ed.insertContent('<div class="synx-column-3"><p>'+ selected_text +'</p></div>');
						}
					}
				]
			});
			ed.addButton('tbl_btn', {
				text: 'テーブル',
				type: 'menubutton',
				menu: [{
						text: '横スクロールなし',
						onclick: function() {
							ed.insertContent('<div class="synx-tbl"><table><thead><tr><th>見出し部分</th><th>見出し部分</th><th>見出し部分</th></tr></thead><tbody><tr><td>内容</td><td>内容</td><td>内容</td></tr><tr><td>内容</td><td>内容</td><td>内容</td></tr></tbody></table></div>');
						}
					},{
						text: '横スクロールあり',
						onclick: function() {
							ed.insertContent('<div class="synx-tbl is-scroll-all" data-scroll-hint="スクロールできます →" style="--table-width:1200px"><table><thead><tr><th>見出し部分</th><th>見出し部分</th><th>見出し部分</th></tr></thead><tbody><tr><td>内容</td><td>内容</td><td>内容</td></tr><tr><td>内容</td><td>内容</td><td>内容</td></tr></tbody></table></div>');
						}
					}
				]
			});
			ed.addButton('box_btn', {
				text: '段落',
				type: 'menubutton',
				menu: [
					{
						text: 'スタイル：三角のあしらい',
						menu: [
							{
								text: 'デフォルトカラー',
								onclick: function() {
									var selected_text = ed.selection.getContent() || 'テキスト';
									ed.insertContent('<p class="is-style-triangle">'+ selected_text +'</p>');
								}
							},
							{
								text: 'カラーセット(1)',
								onclick: function() {
									var selected_text = ed.selection.getContent() || 'テキスト';
									ed.insertContent('<p class="is-style-triangle is-color01">'+ selected_text +'</p>');
								}
							},
							{
								text: 'カラーセット(2)',
								onclick: function() {
									var selected_text = ed.selection.getContent() || 'テキスト';
									ed.insertContent('<p class="is-style-triangle is-color02">'+ selected_text +'</p>');
								}
							},
							{
								text: 'カラーセット(3)',
								onclick: function() {
									var selected_text = ed.selection.getContent() || 'テキスト';
									ed.insertContent('<p class="is-style-triangle is-color03">'+ selected_text +'</p>');
								}
							},
							{
								text: 'カラーセット(4)',
								onclick: function() {
									var selected_text = ed.selection.getContent() || 'テキスト';
									ed.insertContent('<p class="is-style-triangle is-color04">'+ selected_text +'</p>');
								}
							},
						]
					},
				]
			});
			ed.addButton('dl_list_btn', {
				text: '説明リスト（dl）',
				type: 'menubutton',
				menu: [
					{
						text: 'スタイル：デフォルト',
						menu: [
							{
								text: 'デフォルトカラー',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							},{
								text: 'カラーセット(1)',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-color01"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							},{
								text: 'カラーセット(2)',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-color02"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							},{
								text: 'カラーセット(3)',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-color03"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							},{
								text: 'カラーセット(4)',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-color04"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							}
						]
					},
					{
						text: 'スタイル：囲みライン',
						menu: [
							{
								text: 'デフォルトカラー',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-style-outline"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							},{
								text: 'カラーセット(1)',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-style-outline is-color01"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							},{
								text: 'カラーセット(2)',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-style-outline is-color02"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							},{
								text: 'カラーセット(3)',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-style-outline is-color03"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							},{
								text: 'カラーセット(4)',
								onclick: function() {
									ed.insertContent('<dl class="synx-block-dl is-style-outline is-color04"><dt class="synx-block-dl__dt">dtタイトル</dt><dd class="synx-block-dl__dd">dtの内容を説明するテキスト</dd></dl>');
								}
							}
						]
					}
				]
			});
			ed.addButton('shortcode_btn', {
				text: 'ショートコード',// text : ボタンの表示名
				type: 'menubutton',// type: 'menubutton'にすると、プルダウンのようなメニューボタンを作成することができます。
				menu: [
					{
						text: 'ブログカード',
						onclick: function() {
							ed.insertContent('[blogcard url="対象のURL"]');
						}
					},{
						text: '目次',
						onclick: function() {
							ed.insertContent('[synx_toc title="目次" depth="3"]');
						}
					},
				]
			});
			ed.addButton('cta_btn', {
				text: 'CTA',
				type: 'menubutton',
				menu: [
					{
						text: '1カラム',
						onclick: function() {
						ed.insertContent('<div class="cta cta-wide"><p class="cta-wide__ttl">タイトル</p><p class="cta-wide__txt">テキスト</p><p class="cta-wide__btn"><a class="synx-btn is-gradation" href="#">ボタンのリンク</a></p></div>');
						}
					},
				]
			});
	});
})();