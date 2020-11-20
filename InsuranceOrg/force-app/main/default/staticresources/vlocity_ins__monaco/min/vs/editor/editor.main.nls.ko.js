/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.19.3(4bbae4b7d81ecff78ba65ddc8227b542e734257e)
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
define("vs/editor/editor.main.nls.ko",{"vs/base/browser/ui/actionbar/actionbar":["{0}({1})"],"vs/base/browser/ui/aria/aria":["{0}(다시 발생함)","{0} ({1}번 발생하다)"],"vs/base/browser/ui/findinput/findInput":["입력"],"vs/base/browser/ui/findinput/findInputCheckboxes":["대/소문자 구분","단어 단위로","정규식 사용"],"vs/base/browser/ui/findinput/replaceInput":["입력","대/소문자 보존"],"vs/base/browser/ui/inputbox/inputBox":["오류: {0}","경고: {0}","정보: {0}"],"vs/base/browser/ui/keybindingLabel/keybindingLabel":["바인딩 안 됨"],"vs/base/browser/ui/list/listWidget":["{0}. 탐색하려면 탐색 키를 사용하세요."],"vs/base/browser/ui/menu/menu":["{0}({1})"],"vs/base/browser/ui/tree/abstractTree":["지우기","형식을 기준으로 필터링 사용 안 함","형식을 기준으로 필터링 사용","찾은 요소 없음","{1}개 요소 중 {0}개 일치"],"vs/base/common/keybindingLabels":["Ctrl","<Shift>","<Alt>","Windows","Ctrl","<Shift>","<Alt>","슈퍼","제어","<Shift>","<Alt>","명령","제어","<Shift>","<Alt>","Windows","제어","<Shift>","<Alt>","슈퍼"],"vs/base/common/severity":["오류","경고","정보"],"vs/base/parts/quickopen/browser/quickOpenModel":["{0}, 선택기","선택기"],
"vs/base/parts/quickopen/browser/quickOpenWidget":["빠른 선택기입니다. 결과의 범위를 축소하려면 입력합니다.","빠른 선택기","{0}개 결과"],"vs/editor/browser/controller/coreCommands":["모두 선택(&&S)","실행 취소(&&U)","다시 실행(&&R)"],"vs/editor/browser/controller/textAreaHandler":["지금은 편집기를 사용할 수 없습니다. Alt+F1을 눌러 옵션을 보세요."],"vs/editor/browser/widget/codeEditorWidget":["커서 수는 {0}(으)로 제한되었습니다."],"vs/editor/browser/widget/diffEditorWidget":["파일 1개가 너무 커서 파일을 비교할 수 없습니다."],"vs/editor/browser/widget/diffReview":["닫기","줄 없음","1줄","{0}줄","차이 {0}/{1}개: 원본 {2}, {3}, 수정 {4}, {5}","비어 있음","원본 {0}, 수정 {1}: {2}","+ 수정됨 {0}: {1}","- 원본 {0}: {1}","다음 다른 항목으로 이동","다음 다른 항목으로 이동"],"vs/editor/browser/widget/inlineDiffMargin":["삭제된 줄 복사","삭제된 줄 복사","삭제된 줄 복사({0})","이 변경 내용 되돌리기","삭제된 줄 복사({0})"],
"vs/editor/common/config/commonEditorConfig":["편집기","탭 한 개에 해당하는 공백 수입니다. `#editor.detectIndentation#`이 켜져 있는 경우 이 설정은 파일 콘텐츠에 따라 재정의됩니다.","'탭' 키를 누를 때 공백을 삽입합니다. `#editor.detectIndentation#`이 켜져 있는 경우 이 설정은 파일 콘텐츠에 따라 재정의됩니다.","파일을 열 때 파일 콘텐츠를 기반으로 `#editor.tabSize#`와  `#editor.insertSpaces#`가 자동으로 검색되는지 여부를 제어합니다.","끝에 자동 삽입된 공백을 제거합니다.","큰 파일에 대한 특수 처리로, 메모리를 많이 사용하는 특정 기능을 사용하지 않도록 설정합니다.","문서 내 단어를 기반으로 완성을 계산할지 여부를 제어합니다.","해당 콘텐츠를 두 번 클릭하거나 'Esc' 키를 누르더라도 Peek 편집기를 열린 상태로 유지합니다.","이 길이를 초과하는 줄은 성능상의 이유로 토큰화되지 않습니다.","diff 계산이 취소된 후 밀리초 단위로 시간을 제한합니다. 제한 시간이 없는 경우 0을 사용합니다.","diff 편집기에서 diff를 나란히 표시할지 인라인으로 표시할지를 제어합니다.","diff 편집기에서 선행 공백 또는 후행 공백 변경을 diff로 표시할지 여부를 제어합니다.","diff 편집기에서 추가/제거된 변경 내용에 대해 +/- 표시기를 표시하는지 여부를 제어합니다."],
"vs/editor/common/config/editorOptions":["편집기가 스크린 리더가 연결되면 플랫폼 API를 사용하여 감지합니다.","편집기가 스크린 리더 사용을 위해 영구적으로 최적화됩니다.","편집기가 스크린 리더 사용을 위해 최적화되지 않습니다.","편집기를 스크린 리더를 위해 최적화된 모드로 실행할지 결정합니다.","선택 영역 없이 현재 줄 복사 여부를 제어합니다.","편집기 선택에서 Find Widget의 검색 문자열을 시딩할지 여부를 제어합니다.","선택 항목에서 찾기를 자동으로 켜지 않음(기본값)","선택 항목에서 자동으로 항상 찾기 켜기","여러 줄의 콘텐츠를 선택하면 선택 항목에서 찾기가 자동으로 켜집니다.","편집기에서 찾기 작업을 할 때 선택한 텍스트에서 할지 전체 파일에서 할지 제어합니다.","macOS에서 Find Widget이 공유 클립보드 찾기를 읽을지 수정할지 제어합니다.","위젯 찾기에서 편집기 맨 위에 줄을 추가해야 하는지 여부를 제어합니다. true인 경우 위젯 찾기가 표시되면 첫 번째 줄 위로 스크롤할 수 있습니다.","글꼴 합자 사용하거나 사용하지 않도록 설정합니다.","명시적 글꼴 기능 설정입니다.","글꼴 합자를 구성합니다.","픽셀 단위로 글꼴 크기를 제어합니다.","결과 Peek 뷰 표시(기본)","기본 결과로 이동하여 Peek 보기를 표시합니다.","기본 결과로 이동하고 다른 항목에 대해 peek 없는 탐색을 사용하도록 설정","이 설정은 더 이상 사용되지 않습니다. 대신 'editor.editor.gotoLocation.multipleDefinitions' 또는 'editor.editor.gotoLocation.multipleImplementations'와 같은 별도의 설정을 사용하세요.","여러 대상 위치가 있는 경우 '정의로 이동' 명령 동작을 제어합니다.","여러 대상 위치가 있는 경우 '유형 정의로 이동' 명령 동작을 제어합니다.","여러 대상 위치가 있는 경우 'Go to Declaration' 명령 동작을 제어합니다.","여러 대상 위치가 있는 경우 '구현으로 이동' 명령 동작을 제어합니다.","여러 대상 위치가 있는 경우 '참조로 이동' 명령 동작을 제어합니다.","'정의로 이동'의 결과가 현재 위치일 때 실행되는 대체 명령 ID입니다.","'형식 정의로 이동'의 결과가 현재 위치일 때 실행되는 대체 명령 ID입니다.","'선언으로 이동'의 결과가 현재 위치일 때 실행되는 대체 명령 ID입니다.","'구현으로 이동'의 결과가 현재 위치일 때 실행되는 대체 명령 ID입니다.","'참조로 이동'의 결과가 현재 위치일 때 실행되는 대체 명령 ID입니다.","호버 표시 여부를 제어합니다.","호버가 표시되기 전까지의 지연 시간(밀리초)을 제어합니다.","마우스를 해당 항목 위로 이동할 때 호버를 계속 표시할지 여부를 제어합니다.","편집기에서 코드 동작 전구를 사용하도록 설정합니다.","줄 높이를 제어합니다. 글꼴 크기에서 줄 높이를 계산하려면 0을 사용합니다.","미니맵 표시 여부를 제어합니다.","미니맵을 렌더링할 측면을 제어합니다.","미니맵 슬라이더가 표시되는 시기를 제어합니다.","미니맵에 그려진 콘텐츠의 배율입니다.","줄의 실제 문자(색 블록 아님)를 렌더링합니다.","최대 특정 수의 열을 렌더링하도록 미니맵의 너비를 제한합니다.","입력과 동시에 매개변수 문서와 유형 정보를 표시하는 팝업을 사용하도록 설정합니다."," 매개변수 힌트 메뉴의 주기 혹은 목록의 끝에 도달하였을때 종료할 것인지 여부를 결정합니다. ","문자열 내에서 빠른 제안을 사용합니다.","주석 내에서 빠른 제안을 사용합니다.","문자열 및 주석 외부에서 빠른 제안을 사용합니다.","입력하는 동안 제안을 자동으로 표시할지 여부를 제어합니다.","줄 번호는 렌더링되지 않습니다.","줄 번호는 절대값으로 렌더링 됩니다.","줄 번호는 커서 위치에서 줄 간격 거리로 렌더링 됩니다.","줄 번호는 매 10 줄마다 렌더링이 이루어집니다.","줄 번호의 표시 여부를 제어합니다.","특정 수의 고정 폭 문자 뒤에 세로 눈금자를 렌더링합니다. 여러 눈금자의 경우 여러 값을 사용합니다. 배열이 비어 있는 경우 눈금자가 그려지지 않습니다.","커서의 텍스트 오른쪽을 덮어 쓰지않고 제안을 삽입합니다.","제안을 삽입하고 커서의 오른쪽 텍스트를 덮어씁니다.","완료를 수락할 때 단어를 덮어쓸지 여부를 제어합니다. 이것은 이 기능을 선택하는 확장에 따라 다릅니다.","완료를 수락하는 동안 예기치 않은 텍스트 수정이 강조 표시되도록 할지 여부를 제어합니다.(예: 'insertMode'는 '바꾸기'이지만 완료는 '삽입'만 지원합니다.)","제안 필터링 및 정렬에서 작은 오타를 설명하는지 여부를 제어합니다.","정렬할 때 커서 근처에 표시되는 단어를 우선할지 여부를 제어합니다.","저장된 제안 사항 선택 항목을 여러 작업 영역 및 창에서 공유할 것인지 여부를 제어합니다(`#editor.suggestSelection#` 필요).","활성 코드 조각이 빠른 제안을 할 수 없도록 하는지 여부를 제어합니다.","제안의 아이콘을 표시할지 여부를 제어합니다.","스크롤바를 표시하기 전에 IntelliSense가 표시할 제안 수를 제어합니다(최대 15개).","이 설정은 더 이상 사용되지 않습니다. 대신 'editor.suggest.showKeywords'또는 'editor.suggest.showSnippets'와 같은 별도의 설정을 사용하세요.","사용하도록 설정되면 IntelliSense에 `메서드` 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '함수' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '생성자' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '필드' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '변수' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '클래스' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '구조' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '인터페이스' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '모듈' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '속성' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '이벤트' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 `연산자` 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '단위' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '값' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '상수' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '열거형' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 `enumMember` 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '키워드' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '텍스트' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '색' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 `파일` 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '참조' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '사용자 지정 색' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '폴더' 제안이 표시됩니다.","사용하도록 설정된 경우 IntelliSense에 'typeParameter' 제안이 표시됩니다.","사용하도록 설정되면 IntelliSense에 '코드 조각' 제안이 표시됩니다.","커밋 문자에 대한 제안을 허용할지를 제어합니다. 예를 들어 JavaScript에서는 세미콜론(';')이 제안을 허용하고 해당 문자를 입력하는 커밋 문자일 수 있습니다.","텍스트를 변경할 때 `Enter` 키를 사용한 제안만 허용합니다.","'Tab' 키 외에 'Enter' 키에 대한 제안도 허용할지를 제어합니다. 새 줄을 삽입하는 동작과 제안을 허용하는 동작 간의 모호함을 없앨 수 있습니다.","화면 판독기가 읽을 수 있는 편집기의 줄 수를 제어합니다. 경고: 기본값보다 큰 숫자인 경우 성능에 영향을 미칩니다.","편집기 콘텐츠","언어 구성을 사용하여 대괄호를 자동으로 닫을 경우를 결정합니다.","커서가 공백의  왼쪽에 있는 경우에만 대괄호를 자동으로 닫습니다.","사용자가 여는 괄호를 추가한 후 편집기에서 괄호를 자동으로 닫을지 여부를 제어합니다.","닫기 따옴표 또는 대괄호가 자동으로 삽입된 경우에만 해당 항목 위에 입력합니다.","편집자가 닫는 따옴표 또는 대괄호 위에 입력할지 여부를 제어합니다.","언어 구성을 사용하여 따옴표를 자동으로 닫을 경우를 결정합니다.","커서가 공백의 왼쪽에 있는 경우에만 따옴표를 자동으로 닫습니다.","사용자가 여는 따옴표를 추가한 후 편집기에서 따옴표를 자동으로 닫을지 여부를 제어합니다.","편집기는 들여쓰기를 자동으로 삽입하지 않습니다.","편집기는 현재 줄의 들여쓰기를 유지합니다.","편집기는 현재 줄의 들여쓰기를 유지하고 언어 정의 대괄호를 사용합니다.","편집기는 현재 줄의 들여쓰기를 유지하고 언어 정의 대괄호를 존중하며 언어별로 정의된 특별 EnterRules를 호출합니다.","편집기는 현재 줄의 들여쓰기를 유지하고, 언어 정의 대괄호를 존중하고, 언어에 의해 정의된 특별 EnterRules를 호출하고, 언어에 의해 정의된 들여쓰기 규칙을 존중합니다.","사용자가 줄을 입력, 붙여넣기, 이동 또는 들여쓰기 할 때 편집기에서 들여쓰기를 자동으로 조정하도록 할지 여부를 제어합니다.","언어 구성을 사용하여 선택 항목을 자동으로 둘러쌀 경우를 결정합니다.","대괄호가 아닌 따옴표로 둘러쌉니다.","따옴표가 아닌 대괄호로 둘러쌉니다.","편집기에서 선택 항목을 자동으로 둘러쌀지 여부를 제어합니다.","편집기에서 CodeLens를 표시할 것인지 여부를 제어합니다.","편집기에서 인라인 색 데코레이터 및 색 선택을 렌더링할지를 제어합니다.","터미널에서 선택한(블록 지정한) 텍스트가 클립보드로 자동 복사 여부를 제어합니다.\n'true'로 설정 할 시 선택할 때마다 클립보드로 복사 됩니다.","커서 애니메이션 스타일을 제어합니다.","매끄러운 캐럿 애니메이션의 사용 여부를 제어합니다.","커서 스타일을 제어합니다.","커서 주위에 표시되는 선행 및 후행 줄의 최소 수를 제어합니다. 다른 편집기에서는 'scrollOff' 또는 'scrollOffset'이라고 합니다.","'cursorSurroundingLines'는 키보드 나 API를 통해 트리거될 때만 적용됩니다.","`cursorSurroundingLines`는 항상 적용됩니다.","'cursorSurroundingLines'를 적용해야 하는 경우를 제어합니다.","`#editor.cursorStyle#` 설정이 'line'으로 설정되어 있을 때 커서의 넓이를 제어합니다.","편집기에서 끌어서 놓기로 선택 영역을 이동할 수 있는지 여부를 제어합니다.","'Alt' 키를 누를 때 스크롤 속도 승수입니다.","편집기에 코드 접기가 사용하도록 설정되는지 여부를 제어합니다.","접기 범위를 계산하는 전략을 제어합니다. '자동'이면 사용 가능한 경우 언어 관련 접기 전략을 사용합니다. '들여쓰기'이면 들여쓰기 기반 접기 전략을 사용합니다.","글꼴 패밀리를 제어합니다.","글꼴 두께를 조정합니다.","붙여넣은 콘텐츠의 서식을 편집기에서 자동으로 지정할지 여부를 제어합니다. 포맷터를 사용할 수 있어야 하며 포맷터가 문서에서 범위의 서식을 지정할 수 있어야 합니다.","입력 후 편집기에서 자동으로 줄의 서식을 지정할지 여부를 제어합니다.","편집기에서 세로 문자 모양 여백을 렌더링할지 여부를 제어합니다. 문자 모양 여백은 주로 디버깅에 사용됩니다.","커서가 개요 눈금자에서 가려져야 하는지 여부를 제어합니다.","편집기에서 활성 들여쓰기 가이드를 강조 표시할지 여부를 제어합니다.","픽셀 단위로 문자 간격을 제어 합니다.","편집기에서 링크를 감지하고 클릭할 수 있게 만들지 여부를 제어합니다.","일치하는 대괄호를 강조 표시합니다.","마우스 휠 스크롤 이벤트의 `deltaX` 및 `deltaY`에서 사용할 승수입니다.","마우스 휠을 사용할 때 'Ctrl' 키를 누르고 있으면 편집기의 글꼴을 확대/축소합니다.","여러 커서가 겹치는 경우 커서를 병합합니다.","Windows와 Linux의 'Control'을 macOS의 'Command'로 매핑합니다.","Windows와 Linux의 'Alt'를 macOS의 'Option'으로 매핑합니다.","마우스로 여러 커서를 추가할 때 사용할 수정자입니다. [정의로 이동] 및 [링크 열기] 마우스 제스처가 멀티커서 수정자와 충돌하지 않도록 조정됩니다. [자세한 정보](https://code.visualstudio.com/docs/editor/codebasics#_multicursor-modifier).","각 커서는 텍스트 한 줄을 붙여넣습니다.","각 커서는 전체 텍스트를 붙여넣습니다.","붙여넣은 텍스트의 줄 수가 커서 수와 일치하는 경우 붙여넣기를 제어합니다.","편집기에서 의미 체계 기호 항목을 강조 표시할지 여부를 제어합니다.","개요 눈금자 주위에 테두리를 그릴지 여부를 제어합니다.","빠른 제안을 표시하기 전까지의 지연 시간(밀리초)을 제어합니다.","편집기에서 제어 문자를 렌더링할지를 제어합니다.","편집기에서 들여쓰기 가이드를 렌더링할지를 제어합니다.","파일이 줄 바꿈으로 끝나면 마지막 줄 번호를 렌더링합니다.","제본용 여백과 현재 줄을 모두 강조 표시합니다.","편집기가 현재 줄 강조 표시를 렌더링하는 방식을 제어합니다. ","Render whitespace characters except for single spaces between words.","선택한 텍스트에서만 공백 문자를 렌더링합니다.","편집기에서 공백 문자를 렌더링할 방법을 제어합니다.","선택 항목의 모서리를 둥글게 할지 여부를 제어합니다.","편집기에서 가로로 스크롤되는 범위를 벗어나는 추가 문자의 수를 제어합니다.","편집기에서 마지막 줄 이후로 스크롤할지 여부를 제어합니다.","Linux 주 클립보드의 지원 여부를 제어합니다.","편집기가 선택 항목과 유사한 일치 항목을 강조 표시해야하는지 여부를 제어합니다.","거터의 폴드 컨트롤을 자동으로 숨길지 결정합니다.","사용하지 않는 코드의 페이드 아웃을 제어합니다.","다른 제안 위에 조각 제안을 표시합니다.","다른 제안 아래에 조각 제안을 표시합니다.","다른 제안과 함께 조각 제안을 표시합니다.","코드 조각 제안을 표시하지 않습니다.\n","코드 조각이 다른 추천과 함께 표시되는지 여부 및 정렬 방법을 제어합니다.","편집기에서 애니메이션을 사용하여 스크롤할지 여부를 제어합니다.","제안 위젯의 글꼴 크기입니다. '0'으로 설정하면 '#editor.fontSize#'의 값이 사용됩니다.","제안 위젯의 줄 높이입니다. '0'으로 설정하면 `#editor.lineHeight#`의 값이 사용됩니다.","트리거 문자를 입력할 때 제안을 자동으로 표시할지 여부를 제어합니다.","항상 첫 번째 제안을 선택합니다.","`log`가 최근에 완료되었으므로 추가 입력에서 제안을 선택하지 않은 경우 최근 제안을 선택하세요(예: `console.| -> console.log`).","해당 제안을 완료한 이전 접두사에 따라 제안을 선택합니다(예: `co -> console` 및 `con -> const`).","제안 목록을 표시할 때 제한이 미리 선택되는 방식을 제어합니다.","탭 완료는 탭을 누를 때 가장 일치하는 제안을 삽입합니다.","탭 완성을 사용하지 않도록 설정합니다.","접두사가 일치하는 경우 코드 조각을 탭 완료합니다. 'quickSuggestions'를 사용하지 않을 때 가장 잘 작동합니다.","탭 완성을 사용하도록 설정합니다.","탭 정지 뒤에 공백을 삽입 및 삭제합니다.","단어 관련 탐색 또는 작업을 수행할 때 단어 구분 기호로 사용할 문자입니다.","줄이 바뀌지 않습니다.","뷰포트 너비에서 줄이 바뀝니다.","`#editor.wordWrapColumn#`에서 줄이 바뀝니다.","뷰포트의 최소값 및 `#editor.wordWrapColumn#`에서 줄이 바뀝니다.","줄 바꿈 여부를 제어합니다.","`#editor.wordWrap#`이 `wordWrapColumn` 또는 'bounded'인 경우 편집기의 열 줄 바꿈을 제어합니다.","들여쓰기가 없습니다. 줄 바꿈 행이 열 1에서 시작됩니다.","줄 바꿈 행의 들여쓰기가 부모와 동일합니다.","줄 바꿈 행이 부모 쪽으로 +1만큼 들여쓰기됩니다.","줄 바꿈 행이 부모 쪽으로 +2만큼 들여쓰기됩니다.","줄 바꿈 행의 들여쓰기를 제어합니다."],
"vs/editor/common/modes/modesRegistry":["일반 텍스트"],
"vs/editor/common/standaloneStrings":["없음 선택","줄 {0}, 열 {1}({2} 선택됨)입니다.","행 {0}, 열 {1}","{0} 선택 항목({1}자 선택됨)","{0} 선택 항목","이제 'accessibilitySupport' 설정을 'on'으로 변경합니다.","지금 편집기 접근성 문서 페이지를 여세요.","차이 편집기의 읽기 전용 창에서.","diff 편집기 창에서."," 읽기 전용 코드 편집기에서"," 코드 편집기에서","화면 판독기 사용에 최적화되도록 편집기를 구성하려면 지금 Command+E를 누르세요.","화면 판독기에 사용할 수 있도록 편집기를 최적화하려면 지금 Ctrl+E를 누르세요.","에디터를 화면 판독기와 함께 사용하기에 적합하도록 구성했습니다.","편집기는 화면 판독기 사용을 위해 절대로 최적화되지 않도록 구성됩니다. 현재로서는 그렇지 않습니다.","현재 편집기에서 <Tab> 키를 누르면 포커스가 다음 포커스 가능한 요소로 이동합니다. {0}을(를) 눌러서 이 동작을 설정/해제합니다.","현재 편집기에서 <Tab> 키를 누르면 포커스가 다음 포커스 가능한 요소로 이동합니다. {0} 명령은 현재 키 바인딩으로 트리거할 수 없습니다.","현재 편집기에서 <Tab> 키를 누르면 탭 문자가 삽입됩니다. {0}을(를) 눌러서 이 동작을 설정/해제합니다.","현재 편집기에서 <Tab> 키를 누르면 탭 문자가 삽입됩니다. {0} 명령은 현재 키 바인딩으로 트리거할 수 없습니다.","Command+H를 눌러 편집기 접근성과 관련된 자세한 정보가 있는 브라우저 창을 여세요.","Ctrl+H를 눌러 편집기 접근성과 관련된 자세한 정보가 있는 브라우저 창을 엽니다.","이 도구 설명을 해제하고 Esc 키 또는 Shift+Esc를 눌러서 편집기로 돌아갈 수 있습니다.","접근성 도움말 표시","개발자: 검사 토큰","줄 {0} 및 문자 {1}(으)로 이동","줄 {0}(으)로 이동","이동할 1과 {0} 사이의 줄 번호 입력","검색하려면 1-{0}자 사이의 문자를 입력하세요.","현재 줄: {0}. 줄 {1}(으)로 이동합니다.","행 번호를 입력하고 콜론(:)과 문자 번호를 입력하여 검색하세요.","줄 이동...","{0}, {1}, 명령","{0}, 명령","실행하려는 작업의 이름을 입력하세요.","명령 팔레트","{0}, 기호","검색하려는 ID의 이름을 입력하세요.","기호로 가서...","기호({0})","모듈({0})","클래스({0})","인터페이스({0})","메서드({0})","함수({0})","속성({0})","변수({0})","변수({0})","생성자({0})","호출({0})","편집기 콘텐츠","내게 필요한 옵션을 보려면 Ctrl+F1을 누릅니다.","접근성 옵션은 Alt+F1을 눌러여 합니다.","고대비 테마로 전환","{1} 파일에서 편집을 {0}개 했습니다."],
"vs/editor/common/view/editorColorRegistry":["커서 위치의 줄 강조 표시에 대한 배경색입니다.","커서 위치의 줄 테두리에 대한 배경색입니다.","빠른 열기 및 찾기 기능 등을 통해 강조 표시된 영역의 배경색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","강조 영역 주변의 테두리에 대한 배경색입니다","강조 표시된 기호(예: 정의로 이동 또는 다음/이전 기호로 이동)의 배경색입니다. 이 색상은 기본 장식을 숨기지 않도록 불투명하지 않아야 합니다.","강조 표시된 기호 주위의 테두리 배경색입니다.","편집기 커서 색입니다.","편집기 커서의 배경색입니다. 블록 커서와 겹치는 글자의 색상을 사용자 정의할 수 있습니다.","편집기의 공백 문자 색입니다.","편집기 들여쓰기 안내선 색입니다.","활성 편집기 들여쓰기 안내선 색입니다.","편집기 줄 번호 색입니다.","편집기 활성 영역 줄번호 색상","ID는 사용되지 않습니다. 대신 'editorLineNumber.activeForeground'를 사용하세요.","편집기 활성 영역 줄번호 색상","편집기 눈금의 색상입니다.","편집기 코드 렌즈의 전경색입니다.","일치하는 괄호 뒤의 배경색","일치하는 브래킷 박스의 색상","개요 눈금 경계의 색상입니다.","편집기 거터의 배경색입니다. 거터에는 글리프 여백과 행 수가 있습니다.","편집기의 불필요한(사용하지 않는) 소스 코드 테두리 색입니다.","편집기의 불필요한(사용하지 않는) 소스 코드 불투명도입니다. 예를 들어 \"#000000c0\"은 75% 불투명도로 코드를 렌더링합니다. 고대비 테마의 경우 페이드 아웃하지 않고 'editorUnnecessaryCode.border' 테마 색을 사용하여 불필요한 코드에 밑줄을 그으세요.","오류의 개요 눈금자 마커 색입니다.","경고의 개요 눈금자 마커 색입니다.","정보의 개요 눈금자 마커 색입니다."],
"vs/editor/contrib/bracketMatching/bracketMatching":["괄호에 해당하는 영역을 표시자에 채색하여 표시합니다.","대괄호로 이동","괄호까지 선택","대괄호로 이동(&&B)"],"vs/editor/contrib/caretOperations/caretOperations":["캐럿을 왼쪽으로 이동","캐럿을 오른쪽으로 이동"],"vs/editor/contrib/caretOperations/transpose":["문자 바꾸기"],"vs/editor/contrib/clipboard/clipboard":["잘라내기","잘라내기(&&T)","복사","복사(&&C)","붙여넣기","붙여넣기(&&P)","구문을 강조 표시하여 복사"],
"vs/editor/contrib/codeAction/codeActionCommands":["실행할 코드 작업의 종류입니다.","반환된 작업이 적용되는 경우를 제어합니다.","항상 반환된 첫 번째 코드 작업을 적용합니다.","첫 번째 반환된 코드 작업을 적용합니다(이 작업만 있는 경우).","반환된 코드 작업을 적용하지 마십시오.","기본 코드 작업만 반환되도록 할지 여부를 제어합니다.","코드 작업을 적용하는 중 알 수 없는 오류가 발생했습니다.","빠른 수정...","사용 가능한 코드 동작이 없습니다.","'{0}'에 대한 기본 코드 작업을 사용할 수 없음","'{0}'에 대한 코드 작업을 사용할 수 없음","사용할 수 있는 기본 코드 작업 없음","사용 가능한 코드 동작이 없습니다.","리팩터링...","'{0}'에 대한 기본 리팩터링 없음","'{0}'에 대한 리팩터링 없음","기본 설정 리팩터링을 사용할 수 없음","사용 가능한 리펙터링이 없습니다.","소스 작업...","'{0}'에 대한 기본 소스 작업을 사용할 수 없음","'{0}'에 대한 소스 작업을 사용할 수 없음","사용할 수 있는 기본 원본 작업 없음","사용 가능한 소스 작업이 없습니다.","가져오기 구성","사용 가능한 가져오기 구성 작업이 없습니다.","모두 수정","모든 작업 수정 사용 불가","자동 수정...","사용할 수 있는 자동 수정 없음"],"vs/editor/contrib/codeAction/lightBulbWidget":["수정 사항을 표시합니다. 사용 가능한 기본 수정({0})","수정 사항 표시({0})","수정 사항 표시"],"vs/editor/contrib/comment/comment":["줄 주석 설정/해제","줄 주석 설정/해제(&&T)","줄 주석 추가","줄 주석 제거","블록 주석 설정/해제","블록 주석 설정/해제(&&B)"],"vs/editor/contrib/contextmenu/contextmenu":["편집기 상황에 맞는 메뉴 표시"],
"vs/editor/contrib/cursorUndo/cursorUndo":["커서 실행 취소","커서 다시 실행"],
"vs/editor/contrib/documentSymbols/outlineTree":["배열 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","부울 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","클래스 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","색 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안에 표시됩니다.","상수 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","생성자 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","열거자 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","열거자 멤버 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","이벤트 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","필드 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","파일 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","폴더 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","함수 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","인터페이스 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","키 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","키워드 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","메서드 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","모듈 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","네임스페이스 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","null 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","숫자 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","개체 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","연산자 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","패키지 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","속성 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","참조 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","코드 조각 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","문자열 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","구조 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","텍스트 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 나타납니다.","형식 매개변수 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","단위 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다.","변수 기호의 전경색입니다. 이러한 기호는 개요, 이동 경로 및 제안 위젯에 표시됩니다."],
"vs/editor/contrib/find/findController":["찾기","찾기(&&F)","선택 영역에서 찾기","다음 찾기","다음 찾기","이전 찾기","이전 찾기","다음 선택 찾기","이전 선택 찾기","바꾸기","바꾸기(&&R)"],"vs/editor/contrib/find/findWidget":["찾기","찾기","이전 일치","다음 일치 항목","선택 항목에서 찾기","닫기","바꾸기","바꾸기","바꾸기","모두 바꾸기","바꾸기 모드 설정/해제","처음 {0}개의 결과가 강조 표시되지만 모든 찾기 작업은 전체 텍스트에 대해 수행됩니다.","{1}의 {0}","결과 없음","{0}개 찾음","{1}에 대해 {0} 찾음","{2}에서 {1}에 대해 {0} 찾음","{1}에 대해 {0} 찾음","Ctrl+Enter를 누르면 이제 모든 항목을 바꾸지 않고 줄 바꿈을 삽입합니다. editor.action.replaceAll의 키 바인딩을 수정하여 이 동작을 재정의할 수 있습니다."],"vs/editor/contrib/folding/folding":["펼치기","재귀적으로 펼치기","접기","접기 전환","재귀적으로 접기","모든 블록 코멘트를 접기","모든 영역 접기","모든 영역 펼치기","모두 접기","모두 펼치기","수준 {0} 접기"],"vs/editor/contrib/fontZoom/fontZoom":["편집기 글꼴 확대","편집기 글꼴 축소","편집기 글꼴 확대/축소 다시 설정"],"vs/editor/contrib/format/format":["줄 {0}에서 1개 서식 편집을 수행했습니다.","줄 {1}에서 {0}개 서식 편집을 수행했습니다.","줄 {0}과(와) {1} 사이에서 1개 서식 편집을 수행했습니다.","줄 {1}과(와) {2} 사이에서 {0}개 서식 편집을 수행했습니다."],"vs/editor/contrib/format/formatActions":["문서 서식","선택 영역 서식"],
"vs/editor/contrib/gotoError/gotoError":["다음 문제로 이동 (오류, 경고, 정보)","이전 문제로 이동 (오류, 경고, 정보)","파일의 다음 문제로 이동 (오류, 경고, 정보)","파일의 이전 문제로 이동 (오류, 경고, 정보)","다음 문제(&&P)","이전 문제(&&P)"],"vs/editor/contrib/gotoError/gotoErrorWidget":["문제 {1}개 중 {0}개","문제 {1}개 중 {0}개","편집기 표식 탐색 위젯 오류 색입니다.","편집기 표식 탐색 위젯 경고 색입니다.","편집기 표식 탐색 위젯 정보 색입니다.","편집기 표식 탐색 위젯 배경입니다."],"vs/editor/contrib/gotoSymbol/goToCommands":["피킹","정의","'{0}'에 대한 정의를 찾을 수 없습니다.","정의를 찾을 수 없음","정의로 이동","정의로 이동(&&D)","측면에서 정의 열기","정의 피킹(Peeking)","선언","'{0}'에 대한 선언을 찾을 수 없음","선언을 찾을 수 없음","선언으로 이동","&&선언으로 이동","'{0}'에 대한 선언을 찾을 수 없음","선언을 찾을 수 없음","선언 미리 보기","형식 정의","'{0}'에 대한 형식 정의를 찾을 수 없습니다.","형식 정의를 찾을 수 없습니다.","형식 정의로 이동","형식 정의로 이동(&&T)","형식 정의 미리 보기","구현","'{0}'에 대한 구현을 찾을 수 없습니다.","구현을 찾을 수 없습니다.","구현으로 이동","구현으로 이동","피킹 구현","'{0}'에 대한 참조가 없습니다.","참조가 없습니다.","참조로 이동","&&참조로 이동","참조","참조 미리 보기","참조","기호로 이동","위치","'{0}'에 대한 결과가 없습니다.","참조"],"vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition":["{0}개 정의를 표시하려면 클릭하세요."],
"vs/editor/contrib/gotoSymbol/peek/referencesController":["로드 중...","{0}({1})"],"vs/editor/contrib/gotoSymbol/peek/referencesTree":["파일을 확인하지 못했습니다.","참조 {0}개","참조 {0}개"],"vs/editor/contrib/gotoSymbol/peek/referencesWidget":["미리 보기를 사용할 수 없음","참조","결과 없음","참조"],"vs/editor/contrib/gotoSymbol/referencesModel":["{2}열, {1}줄, {0}의 기호","{0}의 기호 1개, 전체 경로 {1}","{1}의 기호 {0}개, 전체 경로 {2}","결과 없음","{0}에서 기호 1개를 찾았습니다.","{1}에서 기호 {0}개를 찾았습니다.","{1}개 파일에서 기호 {0}개를 찾았습니다."],"vs/editor/contrib/gotoSymbol/symbolNavigation":["{1}의 {0} 기호, 다음의 경우 {2}","{1}의 기호 {0}"],"vs/editor/contrib/hover/hover":["가리키기 표시","정의 미리 보기 가리킨 항목 표시"],"vs/editor/contrib/hover/modesContentHover":["로드 중...","문제 보기","빠른 수정을 확인하는 중...","빠른 수정을 사용할 수 없음","빠른 수정..."],"vs/editor/contrib/inPlaceReplace/inPlaceReplace":["이전 값으로 바꾸기","다음 값으로 바꾸기"],
"vs/editor/contrib/linesOperations/linesOperations":["위에 줄 복사","위에 줄 복사(&&C)","아래에 줄 복사","아래에 줄 복사(&&P)","중복된 선택 영역","&&중복된 선택 영역","줄 위로 이동","줄 위로 이동(&&V)","줄 아래로 이동","줄 아래로 이동(&&L)","줄을 오름차순 정렬","줄을 내림차순으로 정렬","후행 공백 자르기","줄 삭제","줄 들여쓰기","줄 내어쓰기","위에 줄 삽입","아래에 줄 삽입","왼쪽 모두 삭제","우측에 있는 항목 삭제","줄 연결","커서 주위 문자 바꾸기","대문자로 변환","소문자로 변환","단어의 첫 글자를 대문자로 변환"],"vs/editor/contrib/links/links":["명령 실행","링크로 이동","Cmd+클릭","Ctrl+클릭","Option+클릭","Alt+클릭","{0} 형식이 올바르지 않으므로 이 링크를 열지 못했습니다","대상이 없으므로 이 링크를 열지 못했습니다.","링크 열기"],"vs/editor/contrib/message/messageController":["읽기 전용 편집기에서는 편집할 수 없습니다."],"vs/editor/contrib/multicursor/multicursor":["위에 커서 추가","위에 커서 추가(&&A)","아래에 커서 추가","아래에 커서 추가(&&D)","줄 끝에 커서 추가","줄 끝에 커서 추가(&&U)","맨 아래에 커서 추가","맨 위에 커서 추가","다음 일치 항목 찾기에 선택 항목 추가","다음 항목 추가(&&N)","이전 일치 항목 찾기에 선택 항목 추가","이전 항목 추가(&&R)","다음 일치 항목 찾기로 마지막 선택 항목 이동","마지막 선택 항목을 이전 일치 항목 찾기로 이동","일치 항목 찾기의 모든 항목 선택","모든 항목 선택(&&O)","모든 항목 변경"],"vs/editor/contrib/parameterHints/parameterHints":["매개 변수 힌트 트리거"],
"vs/editor/contrib/parameterHints/parameterHintsWidget":["{0}, 힌트"],"vs/editor/contrib/peekView/peekView":["닫기","Peek 뷰 제목 영역의 배경색입니다.","Peek 뷰 제목 색입니다.","Peek 뷰 제목 정보 색입니다.","Peek 뷰 테두리 및 화살표 색입니다.","Peek 뷰 결과 목록의 배경색입니다.","Peek 뷰 결과 목록에서 라인 노드의 전경색입니다.","Peek 뷰 결과 목록에서 파일 노드의 전경색입니다.","Peek 뷰 결과 목록에서 선택된 항목의 배경색입니다.","Peek 뷰 결과 목록에서 선택된 항목의 전경색입니다.","Peek 뷰 편집기의 배경색입니다.","Peek 뷰 편집기의 거터 배경색입니다.","Peek 뷰 결과 목록의 일치 항목 강조 표시 색입니다.","Peek 뷰 편집기의 일치 항목 강조 표시 색입니다.","Peek 뷰 편집기의 일치 항목 강조 표시 테두리입니다."],"vs/editor/contrib/rename/rename":["결과가 없습니다.","위치 이름을 바꾸는 중 알 수 없는 오류가 발생했습니다.","'{0}'을(를) '{1}'(으)로 이름을 변경했습니다. 요약: {2}","이름 변경을 실행하지 못했습니다.","기호 이름 바꾸기"],"vs/editor/contrib/rename/renameInputField":["입력 이름을 바꾸세요. 새 이름을 입력한 다음 [Enter] 키를 눌러 커밋하세요."],"vs/editor/contrib/smartSelect/smartSelect":["선택 영역 확장","선택 영역 확장(&&E)","선택 영역 축소","선택 영역 축소(&&S)"],
"vs/editor/contrib/snippet/snippetVariables":["일요일","월요일","화요일","수요일","목요일","금요일  ","토요일","일","월","화","수","목","금","토","1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월","1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],"vs/editor/contrib/suggest/suggestController":["{0}의 {1}개의 수정사항을 수락하는 중","제안 항목 트리거"],"vs/editor/contrib/suggest/suggestWidget":["제안 위젯의 배경색입니다.","제안 위젯의 테두리 색입니다.","제안 위젯의 전경색입니다.","제한 위젯에서 선택된 항목의 배경색입니다.","제안 위젯의 일치 항목 강조 표시 색입니다.","자세히 알아보기...{0}","간단히 보기...{0}","로드 중...","로드 중...","제안 항목이 없습니다.","항목 {0}, 문서: {1}"],"vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode":["<Tab> 키로 포커스 이동 설정/해제","이제 <Tab> 키를 누르면 포커스가 다음 포커스 가능한 요소로 이동합니다.","이제 <Tab> 키를 누르면 탭 문자가 삽입됩니다."],"vs/editor/contrib/tokenization/tokenization":["개발자: 강제로 다시 토큰화"],
"vs/editor/contrib/wordHighlighter/wordHighlighter":["변수 읽기와 같은 읽기 액세스 중 기호의 배경색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","변수에 쓰기와 같은 쓰기 액세스 중 기호의 배경색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","변수 읽기와 같은 읽기 액세스 중 기호의 테두리 색입니다.","변수에 쓰기와 같은 쓰기 액세스 중 기호의 테두리 색입니다.","기호 강조 표시의 개요 눈금자 표식 색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","쓰기 액세스 기호에 대한 개요 눈금자 표식 색이 강조 표시됩니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","다음 강조 기호로 이동","이전 강조 기호로 이동","기호 강조 표시 트리거"],"vs/platform/configuration/common/configurationRegistry":["기본 구성 재정의","언어에 대해 재정의할 편집기 설정을 구성합니다.","'{0}'을(를) 등록할 수 없습니다. 이는 언어별 편집기 설정을 설명하는 속성 패턴인 '\\\\[.*\\\\]$'과(와) 일치합니다. 'configurationDefaults' 기여를 사용하세요.","'{0}'을(를) 등록할 수 없습니다. 이 속성은 이미 등록되어 있습니다."],"vs/platform/keybinding/common/abstractKeybindingService":["({0})을(를) 눌렀습니다. 둘째 키는 잠시 기다렸다가 누르세요.","키 조합({0}, {1})은 명령이 아닙니다."],
"vs/platform/list/browser/listService":["워크벤치","Windows와 Linux의 'Control'을 macOS의 'Command'로 매핑합니다.","Windows와 Linux의 'Alt'를 macOS의 'Option'으로 매핑합니다.","마우스로 트리와 목록의 항목을 다중 선택에 추가할 때 사용할 한정자입니다(예를 들어 탐색기에서 편집기와 SCM 보기를 여는 경우). '옆에서 열기' 마우스 제스처(지원되는 경우)는 다중 선택 한정자와 충돌하지 않도록 조정됩니다.","트리와 목록에서 마우스를 사용하여 항목을 여는 방법을 제어합니다(지원되는 경우). 트리에서 자식 항목이 있는 부모 항목의 경우 이 설정은 부모 항목을 한 번 클릭으로 확장할지 또는 두 번 클릭으로 확장할지 여부를 제어합니다. 일부 트리와 목록에서는 이 설정을 적용할 수 없는 경우  무시하도록 선택할 수 있습니다. ","Workbench에서 목록 및 트리가 가로 스크롤을 지원하는지 여부를 제어합니다.","워크벤치에서 수평 스크롤 지원 여부를 제어 합니다.","이 설정은 사용되지 않습니다. 대신 '{0}'을(를) 사용하세요.","트리 들여쓰기를 픽셀 단위로 제어합니다.","트리에서 들여쓰기 가이드를 렌더링할지 여부를 제어합니다.","간단한 키보드 탐색에서는 키보드 입력과 일치하는 요소에 집중합니다. 일치는 접두사에서만 수행됩니다.","키보드 탐색 강조 표시에서는 키보드 입력과 일치하는 요소를 강조 표시합니다. 이후로 탐색에서 위 및 아래로 이동하는 경우 강조 표시된 요소만 트래버스합니다.","키보드 탐색 필터링에서는 키보드 입력과 일치하지 않는 요소를 모두 필터링하여 숨깁니다.","워크벤치의 목록 및 트리 키보드 탐색 스타일을 제어합니다. 간소화하고, 강조 표시하고, 필터링할 수 있습니다.","목록 및 트리에서 키보드 탐색이 입력만으로 자동 트리거되는지 여부를 제어합니다. 'false'로 설정하면 'list.toggleKeyboardNavigation' 명령을 실행할 때만 키보드 탐색이 트리거되어 바로 가기 키를 할당할 수 있습니다."],
"vs/platform/markers/common/markers":["오류","경고","정보"],
"vs/platform/theme/common/colorRegistry":["전체 전경색입니다. 이 색은 구성 요소에서 재정의하지 않은 경우에만 사용됩니다.","오류 메시지에 대한 전체 전경색입니다. 이 색은 구성 요소에서 재정의하지 않은 경우에만 사용됩니다.","포커스가 있는 요소의 전체 테두리 색입니다. 이 색은 구성 요소에서 재정의하지 않은 경우에만 사용됩니다.","더 뚜렷이 대비되도록 요소를 다른 요소와 구분하는 요소 주위의 추가 테두리입니다.","더 뚜렷이 대비되도록 요소를 다른 요소와 구분하는 활성 요소 주위의 추가 테두리입니다.","텍스트 내 링크의 전경색입니다.","텍스트 내 코드 블록의 전경색입니다.","편집기 내에서 찾기/바꾸기 같은 위젯의 그림자 색입니다.","입력 상자 배경입니다.","입력 상자 전경입니다.","입력 상자 테두리입니다.","입력 필드에서 활성화된 옵션의 테두리 색입니다.","입력 필드에서 활성화된 옵션의 배경색입니다.","정보 심각도의 입력 유효성 검사 배경색입니다.","정보 심각도의 입력 유효성 검사 전경색입니다.","정보 심각도의 입력 유효성 검사 테두리 색입니다.","경고 심각도의 입력 유효성 검사 배경색입니다.","경고 심각도의 입력 유효성 검사 전경색입니다.","경고 심각도의 입력 유효성 검사 테두리 색입니다.","오류 심각도의 입력 유효성 검사 배경색입니다.","오류 심각도의 입력 유효성 검사 전경색입니다.","오류 심각도의 입력 유효성 검사 테두리 색입니다.","드롭다운 배경입니다.","드롭다운 전경입니다.","그룹화 레이블에 대한 빠른 선택기 색입니다.","그룹화 테두리에 대한 빠른 선택기 색입니다.","배지 배경색입니다. 배지는 검색 결과 수와 같은 소량의 정보 레이블입니다.","배지 전경색입니다. 배지는 검색 결과 수와 같은 소량의 정보 레이블입니다.","스크롤되는 보기를 나타내는 스크롤 막대 그림자입니다.","스크롤 막대 슬라이버 배경색입니다.","마우스로 가리킬 때 스크롤 막대 슬라이더 배경색입니다.","클릭된 상태일 때 스크롤 막대 슬라이더 배경색입니다.","오래 실행 중인 작업에 대해 표시되는 진행률 표시 막대의 배경색입니다.","편집기 내 오류 표시선의 전경색입니다.","편집기에서 오류 상자의 테두리 색입니다.","편집기 내 경고 표시선의 전경색입니다.","편집기에서 경고 상자의 테두리 색입니다.","편집기 내 정보 표시선의 전경색입니다.","편집기에서 정보 상자의 테두리 색입니다.","편집기에서 힌트 표시선의 전경색입니다.","편집기에서 힌트 상자의 테두리 색입니다.","편집기 배경색입니다.","편집기 기본 전경색입니다.","찾기/바꾸기 같은 편집기 위젯의 배경색입니다.","찾기/바꾸기와 같은 편집기 위젯의 전경색입니다.","편집기 위젯의 테두리 색입니다. 위젯에 테두리가 있고 위젯이 색상을 무시하지 않을 때만 사용됩니다.","편집기 위젯 크기 조정 막대의 테두리 색입니다. 이 색은 위젯에서 크기 조정 막대를 표시하도록 선택하고 위젯에서 색을 재지정하지 않는 경우에만 사용됩니다.","편집기 선택 영역의 색입니다.","고대비를 위한 선택 텍스트의 색입니다.","비활성 편집기의 선택 항목 색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","선택 영역과 동일한 콘텐츠가 있는 영역의 색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","선택 영역과 동일한 콘텐츠가 있는 영역의 테두리 색입니다.","현재 검색 일치 항목의 색입니다.","기타 검색 일치 항목의 색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","검색을 제한하는 범위의 색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","현재 검색과 일치하는 테두리 색입니다.","다른 검색과 일치하는 테두리 색입니다.","검색을 제한하는 범위의 테두리 색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","호버가 표시된 단어 아래를 강조 표시합니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","편집기 호버의 배경색.","편집기 호버의 전경색입니다.","편집기 호버의 테두리 색입니다.","편집기 호버 상태 표시줄의 배경색입니다.","활성 링크의 색입니다.","전구 작업 아이콘에 사용되는 색상입니다.","전구 자동 수정 작업 아이콘에 사용되는 색상입니다.","삽입된 텍스트의 배경색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","제거된 텍스트 배경색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","삽입된 텍스트의 윤곽선 색입니다.","제거된 텍스트의 윤곽선 색입니다.","두 텍스트 편집기 사이의 테두리 색입니다.","목록/트리가 활성 상태인 경우 포커스가 있는 항목의 목록/트리 배경색입니다. 목록/트리가 활성 상태이면 키보드 포커스를 가지며, 비활성 상태이면 포커스가 없습니다.","목록/트리가 활성 상태인 경우 포커스가 있는 항목의 목록/트리 전경색입니다. 목록/트리가 활성 상태이면 키보드 포커스를 가지며, 비활성 상태이면 포커스가 없습니다.","목록/트리가 활성 상태인 경우 선택한 항목의 목록/트리 배경색입니다. 목록/트리가 활성 상태이면 키보드 포커스를 가지며, 비활성 상태이면 포커스가 없습니다.","목록/트리가 활성 상태인 경우 선택한 항목의 목록/트리 전경색입니다. 목록/트리가 활성 상태이면 키보드 포커스를 가지며, 비활성 상태이면 포커스가 없습니다.","목록/트리가 비활성 상태인 경우 선택한 항목의 목록/트리 배경색입니다. 목록/트리가 활성 상태이면 키보드 포커스를 가지며, 비활성 상태이면 포커스가 없습니다.","목록/트리가 비활성 상태인 경우 선택한 항목의 목록/트리 전경색입니다. 목록/트리가 활성 상태이면 키보드 포커스를 가지며, 비활성 상태이면 포커스가 없습니다.","목록/트리가 비활성 상태인 경우 포커스가 있는 항목의 목록/트리 배경색입니다. 목록/트리가 활성 상태이면 키보드 포커스를 가지며, 비활성 상태이면 포커스가 없습니다.","마우스로 항목을 가리킬 때 목록/트리 배경입니다.","마우스로 항목을 가리킬 때 목록/트리 전경입니다.","마우스로 항목을 이동할 때 목록/트리 끌어서 놓기 배경입니다.","목록/트리 내에서 검색할 때 일치 항목 강조 표시의 목록/트리 전경색입니다.","목록 및 트리에서 형식 필터 위젯의 배경색입니다.","목록 및 트리에서 형식 필터 위젯의 윤곽 색입니다.","일치하는 항목이 없을 때 목록 및 트리에서 표시되는 형식 필터 위젯의 윤곽 색입니다.","들여쓰기 가이드의 트리 스트로크 색입니다.","메뉴 테두리 색입니다.","메뉴 항목 전경색입니다.","메뉴 항목 배경색입니다.","메뉴의 선택된 메뉴 항목 전경색입니다.","메뉴의 선택된 메뉴 항목 배경색입니다.","메뉴의 선택된 메뉴 항목 테두리 색입니다.","메뉴에서 구분 기호 메뉴 항목의 색입니다.","코드 조각 탭 정지의 강조 표시 배경색입니다.","코드 조각 탭 정지의 강조 표시 테두리 색입니다.","코드 조각 마지막 탭 정지의 강조 표시 배경색입니다.","코드 조각 마지막 탭 정지의 강조 표시 배경색입니다.","일치 항목 찾기의 개요 눈금자 표식 색입니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","선택 항목의 개요 눈금자 표식 색이 강조 표시됩니다. 기본 장식을 숨기지 않도록 색은 불투명하지 않아야 합니다.","일치하는 항목을 찾기 위한 미니맵 표식 색입니다.","편집기 선택 작업을 위한 미니맵 마커 색입니다.","오류에 대한 미니맵 마커 색상입니다.","경고의 미니맵 마커 색상입니다.","문제 오류 아이콘에 사용되는 색입니다.","문제 경고 아이콘에 사용되는 색입니다.","문제 정보 아이콘에 사용되는 색입니다."]
});
//# sourceMappingURL=../../../min-maps/vs/editor/editor.main.nls.ko.js.map