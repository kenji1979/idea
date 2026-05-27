(function () {
  "use strict";

  const WEEKS = [
  {
    "n": 1,
    "title": "第1週 — 指板の地図と体の準備",
    "summary": "音名のルールと、指板を「地図」として眺める習慣をつくります。無理に速弾きしません。",
    "days": [
      {
        "dow": "月",
        "title": "自然音名とチューニング",
        "minutes": 35,
        "goal": "チューニングの意味が言える。指板上の「すべてのC」を目で追える。",
        "steps": [
          "ウォームアップ（3分）：肩を回し、手首を軽く回す。ベースを持つ前に深呼吸。",
          "チューニング（7分）：下からE・A・D・G。クリップチューナーなら弦を一音ずつ鳴らし、針が安定するまで調整。",
          "指板ラボ（10分）：下の「指板に反映」を押し、すべてのCの位置を弦ごとに声に出して読む（ベースがなくても可）。",
          "実機（10分）：4弦オープンから5フレットまでをゆっくり一音ずつ。左手は親指の位置を意識し、無理な力を抜く。",
          "振り返り（5分）：今日覚えたCの位置を紙に1つメモ。明日見返す。"
        ],
        "preset": {
          "root": "C",
          "scale": "major",
          "showDegrees": false,
          "showAllNotes": true
        }
      },
      {
        "dow": "火",
        "title": "半音・全音と「隣のマス」",
        "minutes": 30,
        "goal": "1フレットが半音、2フレットが全音だと説明できる。",
        "steps": [
          "ウォームアップ（3分）：指の付け根を軽く伸ばす。",
          "指板ラボ（12分）：音名をすべて表示したまま、任意の弦で「0→1→3→5」と進み、半音と全音がどう並ぶか口頭で確認。",
          "実機（10分）：1弦だけで、フレット1つずつ上がり下がり（音程より「運指の軽さ」を優先）。",
          "クールダウン（5分）：今日の発見を一文で書く。"
        ],
        "preset": {
          "root": "G",
          "scale": "major",
          "showDegrees": false,
          "showAllNotes": true
        }
      },
      {
        "dow": "水",
        "title": "4弦のルート（EとA）を身体に覚えさせる",
        "minutes": 35,
        "goal": "オープンEとオープンAの音が頭の中で思い浮かぶ。",
        "steps": [
          "チューニング確認（5分）。",
          "指板ラボ（10分）：ルートE・メジャーで度数表示。3度・5度のマスを指でなぞるだけ（無音でも可）。",
          "実機（15分）：Eの長音4拍×2回、Aの長音同様。右手はピックか指か、普段の奏法で統一。",
          "振り返り（5分）：EとAの五度関係を口頭で復唱。"
        ],
        "preset": {
          "root": "E",
          "scale": "major",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "木",
        "title": "マイナー・ペンタの「5つの音」",
        "minutes": 35,
        "goal": "マイナー・ペンタに含まれる音名を言える（ルートAの場合）。",
        "steps": [
          "指板ラボ（15分）：反映後、度数1・3・4・5・7（ペンタの並び）を声に出す。",
          "実機（15分）：Aマイナー・ペンタの音だけを、1小節4拍の長音で順番に（テンポ60程度）。",
          "メモ（5分）：自分の指で押さえやすい順番を書き留める。"
        ],
        "preset": {
          "root": "A",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "金",
        "title": "右手のミュート意識（音を止める）",
        "minutes": 30,
        "goal": "弦を触れている手のどちらかで、音を短く切れるイメージが持てる。",
        "steps": [
          "説明（5分）：ベースは「音を出す」だけでなく「止める」楽器。親指側・手のひら側のどちらで止めるか、鏡の前で一度試す。",
          "実機（20分）：オープンEを「タッ」と短く鳴らして止める×16回。無理に速くしない。",
          "指板ラボ（5分）：Aマイナー・ペンタ表示のまま、ルートのマスをクリックして音の高さを確認。"
        ],
        "preset": {
          "root": "A",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "土",
        "title": "小さな総復習",
        "minutes": 40,
        "goal": "月〜金のどれか1つを「人に説明できる」レベルで言語化できる。",
        "steps": [
          "10分：音名クイズ（自分で出題）。指板ラボで適当なルートに変えて確認。",
          "20分：好きな日のメニューを半分の時間で繰り返す。",
          "10分：ストレッチと水分補給。"
        ]
      },
      {
        "dow": "日",
        "title": "積極的休息",
        "minutes": 20,
        "goal": "手と耳を休めつつ、音楽を聴いてベースラインに意識を向ける。",
        "steps": [
          "好きな曲を1〜2曲。ベースだけ聴こうとする（イコライザで低音を足すのも可）。",
          "指板ラボは任意：ルートをDにしてマイナー・ペンタを眺めるだけ。"
        ],
        "preset": {
          "root": "D",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      }
    ]
  },
  {
    "n": 2,
    "title": "第2週 — マイナー・ペンタを「形」で覚える",
    "summary": "Aマイナー・ペンタを軸に、ルートの探し方とリズムの素地をつくります。",
    "days": [
      {
        "dow": "月",
        "title": "ルート探しゲーム",
        "minutes": 35,
        "goal": "指板上のルートAを3秒以内に見つけられる（サイト上）。",
        "steps": [
          "指板ラボ（15分）：度数表示オン。目を閉じ、開いてからルートだけを探すを5回。",
          "実機（15分）：5フレット付近のAを探し、長音。",
          "メモ（5分）：自分が好きなAの位置を2つ書く。"
        ],
        "preset": {
          "root": "A",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": true
        }
      },
      {
        "dow": "火",
        "title": "3度と5度（ペンタ内）",
        "minutes": 35,
        "goal": "度数の「3」と「5」がどの音名か言える。",
        "steps": [
          "指板ラボ（12分）：反映後、3度と5度のマスを弦をまたいで探す。",
          "実機（18分）：ルート→3度→5度→ルートのループを遅めのテンポで。",
          "振り返り（5分）。"
        ],
        "preset": {
          "root": "A",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "水",
        "title": "別ルートへ移動（Dマイナー・ペンタ）",
        "minutes": 35,
        "goal": "同じ「形」がDに移ると音が変わることを体感する。",
        "steps": [
          "指板ラボ（10分）：Dマイナー・ペンタに切り替え、昨日のAとの違いを観察。",
          "実機（20分）：Dルートの長音から、ペンタ内を上下1オクターブ以内で移動。",
          "クールダウン（5分）。"
        ],
        "preset": {
          "root": "D",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "木",
        "title": "八分音符の「刻み」",
        "minutes": 30,
        "goal": "メトロノームの1拍に2つきちんと収まるイメージが持てる。",
        "steps": [
          "メトロノーム60。ミュート込みで1弦開放を「タタタタ」と8分音符で16小節（無理なら8小節）。",
          "指板ラボ（10分）：Eメジャーで度数を眺めながら、頭でリズムを数える。"
        ],
        "preset": {
          "root": "E",
          "scale": "major",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "金",
        "title": "ブルース・スケールの導入",
        "minutes": 35,
        "goal": "ブルースに入る「ブルーノート（♭5）」の位置を指で示せる。",
        "steps": [
          "指板ラボ（15分）：Aルート・ブルースを表示。度数に注目し、どの音が「外れた感じ」か耳で確認。",
          "実機（15分）：ブルース上り下りを遅めに1回。",
          "メモ（5分）。"
        ],
        "preset": {
          "root": "A",
          "scale": "blues",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "土",
        "title": "録音して自己チェック",
        "minutes": 40,
        "goal": "スマホのボイスメモで10秒録り、客観的に聴く。",
        "steps": [
          "Aマイナー・ペンタで8小節だけ即興（テンポ自由）。録音。",
          "聴き返し：タイミング・音程・余計な弦鳴りの3点だけチェック。",
          "指板ラボで弱かった箇所を再表示。"
        ],
        "preset": {
          "root": "A",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "日",
        "title": "聴解のみ",
        "minutes": 25,
        "goal": "ブルースまたはファンクの曲でベースラインを追う。",
        "steps": [
          "曲を1曲選び、イントロからサビまで聴く。コード進行は調べなくてよい。",
          "任意：指板で同じルートのマイナー・ペンタを表示して眺める。"
        ],
        "preset": {
          "root": "A",
          "scale": "blues",
          "showDegrees": true,
          "showAllNotes": false
        }
      }
    ]
  },
  {
    "n": 3,
    "title": "第3週 — メジャー・ペンタと「明るい」響き",
    "summary": "メジャー・ペンタの音程感を身につけ、マイナーとの使い分けの素地をつくります。",
    "days": [
      {
        "dow": "月",
        "title": "メジャー・ペンタの5音",
        "minutes": 35,
        "goal": "Gメジャー・ペンタの各度数が言える。",
        "steps": [
          "指板ラボ（15分）：Gメジャー・ペンタ。度数と音名を声に出す。",
          "実機（15分）：上り下りを長めの音符で。",
          "振り返り（5分）。"
        ],
        "preset": {
          "root": "G",
          "scale": "major_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "火",
        "title": "マイナーとの比較（同じルート）",
        "minutes": 35,
        "goal": "同じGでもマイナー・ペンタとメジャー・ペンタで色が変わることを説明できる。",
        "steps": [
          "指板ラボ：まずGマイナー・ペンタを10分。次にGメジャー・ペンタを10分。違う音はどれか書き出す。",
          "実機（12分）：同じフレット付近で両方を試す（無理に速くしない）。"
        ],
        "preset": {
          "root": "G",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "水",
        "title": "メジャー（イオニアン）の全体像",
        "minutes": 40,
        "goal": "メジャースケールが7音であることを知る（弾き切れなくてよい）。",
        "steps": [
          "指板ラボ（20分）：Cメジャー。度数1〜7を順に読む。",
          "実機（15分）：Cメジャー上りを1オクターブ以内で、できる範囲で。",
          "メモ（5分）。"
        ],
        "preset": {
          "root": "C",
          "scale": "major",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "木",
        "title": "リズムの「拍の頭」",
        "minutes": 30,
        "goal": "小節の1拍目にルートを置くイメージが持てる。",
        "steps": [
          "メトロノーム70。4小節だけ、各小節の1拍目にルート（実機）。",
          "指板ラボ：Fメジャー・ペンタでルート位置を確認。"
        ],
        "preset": {
          "root": "F",
          "scale": "major_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "金",
        "title": "ドリアン入門（雰囲気）",
        "minutes": 35,
        "goal": "ドリアンの「マイナーだけど明るめ」という説明ができる。",
        "steps": [
          "指板ラボ（15分）：Dドリアン。ナチュラル・マイナーと見比べる（別日でも可、今日はドリアンのみでもよい）。",
          "実機（15分）：Dマイナー・ペンタとDドリアンを行き来。",
          "メモ（5分）。"
        ],
        "preset": {
          "root": "D",
          "scale": "dorian",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "土",
        "title": "即興ミニセッション",
        "minutes": 40,
        "goal": "メジャー・ペンタだけで16小節、録音する。",
        "steps": [
          "テンポ72。Gメジャー・ペンタ。",
          "録音後、1つだけ改善点を決めてもう一度8小節。"
        ],
        "preset": {
          "root": "G",
          "scale": "major_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "日",
        "title": "軽めの復習",
        "minutes": 25,
        "goal": "第2週の任意の日を10分で繰り返す。",
        "steps": [
          "好きな1日を選び、ステップの半分だけ実施。",
          "ストレッチ。"
        ]
      }
    ]
  },
  {
    "n": 4,
    "title": "第4週 — ナチュラル・マイナーと旋律の種",
    "summary": "7音のマイナーをゆっくり扱い、旋律の「種」を集めます。",
    "days": [
      {
        "dow": "月",
        "title": "ナチュラル・マイナーの度数",
        "minutes": 40,
        "goal": "Aナチュラル・マイナーの1度と6度の音名が言える。",
        "steps": [
          "指板ラボ（20分）：Aナチュラル・マイナー。1〜7度を読み上げ。",
          "実機（15分）：上りだけゆっくり。",
          "振り返り（5分）。"
        ],
        "preset": {
          "root": "A",
          "scale": "natural_minor",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "火",
        "title": "マイナーとペンタの包含関係",
        "minutes": 35,
        "goal": "マイナー・ペンタの音はナチュラル・マイナーに含まれると言える。",
        "steps": [
          "指板ラボ：同じAでナチュラル・マイナーとマイナー・ペンタを切り替え、共通音をメモ。",
          "実機（20分）：ペンタだけでフレーズを2つ作る。"
        ],
        "preset": {
          "root": "A",
          "scale": "natural_minor",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "水",
        "title": "旋律の種：2度と3度",
        "minutes": 35,
        "goal": "ルートの上の2度・下の3度の位置を探すのが速くなる。",
        "steps": [
          "指板ラボ：Eマイナー・ペンタ→Eナチュラル・マイナーで2度3度を確認。",
          "実機：短い動き「1-2-1」「1-3-1」を遅めに。"
        ],
        "preset": {
          "root": "E",
          "scale": "natural_minor",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "木",
        "title": "ミクソリディアン（雰囲気）",
        "minutes": 35,
        "goal": "「メジャーに近いが7度が♭7」という説明の素地をつくる。",
        "steps": [
          "指板ラボ（15分）：GミクソリディアンとGメジャーを比較。",
          "実機（15分）：Gマイナー・ペンタと行き来。",
          "メモ（5分）。"
        ],
        "preset": {
          "root": "G",
          "scale": "mixolydian",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "金",
        "title": "休符のあるフレーズ",
        "minutes": 30,
        "goal": "「音を出さない拍」を意図的に作る。",
        "steps": [
          "メトロノーム65。2小節に1拍だけ休むパターンを8小節。",
          "指板ラボ：Aマイナー・ペンタで音名をすべて表示し、ルート以外も読み返す。"
        ],
        "preset": {
          "root": "A",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": true
        }
      },
      {
        "dow": "土",
        "title": "週のまとめ録音",
        "minutes": 45,
        "goal": "今週学んだスケールから2種類以上を混ぜた16小節を録音。",
        "steps": [
          "準備5分、録音3テイク、ベストを保存。",
          "自己評価を3行で書く。"
        ]
      },
      {
        "dow": "日",
        "title": "完全休養かウォーキング",
        "minutes": 15,
        "goal": "手を休める。耳だけで好きなベースを聴く。",
        "steps": [
          "軽い散歩＋ストレッチ推奨。"
        ]
      }
    ]
  },
  {
    "n": 5,
    "title": "第5週 — ブルースと「ブルーノート」の扱い",
    "summary": "ブルース・スケールを軸に、半音の「ずらし」の聴覚訓練をします。",
    "days": [
      {
        "dow": "月",
        "title": "ブルース上り下り",
        "minutes": 35,
        "goal": "Aブルースを遅めに上り下りできる。",
        "steps": [
          "指板ラボ10分＋実機20分＋メモ5分。"
        ],
        "preset": {
          "root": "A",
          "scale": "blues",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "火",
        "title": "♭5だけ長音",
        "minutes": 30,
        "goal": "ブルーノートの響きに慣れる。",
        "steps": [
          "指板で♭5の位置を確認後、実機で長音と周辺音の往復。"
        ],
        "preset": {
          "root": "A",
          "scale": "blues",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "水",
        "title": "シャッフルリズムの素振り",
        "minutes": 35,
        "goal": "三連符気分の8分を身体で取る。",
        "steps": [
          "メトロノームは遅め。右手だけで弦をミュートしながらリズムパターン。"
        ]
      },
      {
        "dow": "木",
        "title": "Dブルースで移調感覚",
        "minutes": 35,
        "goal": "形は同じでルートが変わることを再確認。",
        "steps": [
          "指板＋実機。録音任意。"
        ],
        "preset": {
          "root": "D",
          "scale": "blues",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "金",
        "title": "12小節進行は聴くだけ",
        "minutes": 30,
        "goal": "12小節ブルースの曲を最後まで聴く。",
        "steps": [
          "紙に「テーマ→ソロの雰囲気」を箇条書き。"
        ],
        "preset": {
          "root": "E",
          "scale": "blues",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "土",
        "title": "ミニジャム",
        "minutes": 40,
        "goal": "ブルースとマイナー・ペンタを混ぜる。",
        "steps": [
          "8小節ブルース＋8小節ペンタの即興を録音。"
        ],
        "preset": {
          "root": "A",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "日",
        "title": "復習とストレッチ",
        "minutes": 25,
        "goal": "第4週の任意メニューを短縮再開。",
        "steps": []
      }
    ]
  },
  {
    "n": 6,
    "title": "第6週 — ドリアンとコードトーン意識",
    "summary": "ドリアンの6度を活かす耳と、ルート・5度の強調を続けます。",
    "days": [
      {
        "dow": "月",
        "title": "ドリアン上り",
        "minutes": 35,
        "goal": "Dドリアンをゆっくり上れる範囲を広げる。",
        "steps": [],
        "preset": {
          "root": "D",
          "scale": "dorian",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "火",
        "title": "ルートと5度の往復",
        "minutes": 30,
        "goal": "拍が安定する。",
        "steps": [
          "メトロノームと実機。指板でEマイナー・ペンタの1と5を確認。"
        ],
        "preset": {
          "root": "E",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "水",
        "title": "ドリアンとナチュラル・マイナー比較",
        "minutes": 40,
        "goal": "6度の違いを言葉にする。",
        "steps": [
          "指板でAの両方を切替、耳と目で比較。"
        ],
        "preset": {
          "root": "A",
          "scale": "dorian",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "木",
        "title": "メジャー・ペンタでコード感",
        "minutes": 35,
        "goal": "明るいループに乗るイメージ。",
        "steps": [],
        "preset": {
          "root": "C",
          "scale": "major_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "金",
        "title": "左手の親指位置チェック",
        "minutes": 30,
        "goal": "首の裏に親指を置きすぎない。",
        "steps": [
          "鏡またはスマホ動画で30秒確認＋実機15分。"
        ]
      },
      {
        "dow": "土",
        "title": "16小節即興（ドリアン中心）",
        "minutes": 45,
        "goal": "録音して聴き返す。",
        "steps": [],
        "preset": {
          "root": "D",
          "scale": "dorian",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "日",
        "title": "聴解",
        "minutes": 25,
        "goal": "モード感のある曲を1曲。",
        "steps": []
      }
    ]
  },
  {
    "n": 7,
    "title": "第7週 — ミクソリディアンとロック／ポップの匂い",
    "summary": "♭7の響きを身体で覚え、メジャーとの差を定着させます。",
    "days": [
      {
        "dow": "月",
        "title": "Gミクソリディアン往復",
        "minutes": 35,
        "goal": "♭7の音名を言える。",
        "steps": [],
        "preset": {
          "root": "G",
          "scale": "mixolydian",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "火",
        "title": "メジャーとの差分練習",
        "minutes": 35,
        "goal": "7度だけ違うと説明できる。",
        "steps": [
          "指板でGメジャーとGミクソリディアンを交互に。"
        ],
        "preset": {
          "root": "G",
          "scale": "major",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "水",
        "title": "5度オクターブのルート移動",
        "minutes": 40,
        "goal": "同じ形でルートが変わる練習。",
        "steps": [],
        "preset": {
          "root": "F",
          "scale": "mixolydian",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "木",
        "title": "テンポ＋5上げ挑戦",
        "minutes": 30,
        "goal": "昨日より5 BPMだけ上げる。",
        "steps": [],
        "preset": {
          "root": "A",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "金",
        "title": "曲のサビ前だけコピー",
        "minutes": 40,
        "goal": "好きな曲のベース4小節。",
        "steps": []
      },
      {
        "dow": "土",
        "title": "総合録音",
        "minutes": 50,
        "goal": "今週のスケールを混ぜて24小節。",
        "steps": []
      },
      {
        "dow": "日",
        "title": "計画の見直し",
        "minutes": 30,
        "goal": "来週以降の目標を3行で書く。",
        "steps": []
      }
    ]
  },
  {
    "n": 8,
    "title": "第8週 — 総仕上げと自分用カリキュラム化",
    "summary": "振り返り、弱点補強、今後の独学の型を作ります。",
    "days": [
      {
        "dow": "月",
        "title": "弱点スケール診断",
        "minutes": 40,
        "goal": "最も時間がかかったスケールを1つ選ぶ。",
        "steps": [
          "指板でそのスケールだけ30分。"
        ],
        "preset": {
          "root": "A",
          "scale": "natural_minor",
          "showDegrees": true,
          "showAllNotes": true
        }
      },
      {
        "dow": "火",
        "title": "好きな週をもう一度",
        "minutes": 35,
        "goal": "第1〜7週から1週選び再実行（短縮可）。",
        "steps": []
      },
      {
        "dow": "水",
        "title": "メトロノーム耐性",
        "minutes": 35,
        "goal": "苦手テンポ帯を決めて10分×3セット。",
        "steps": [],
        "preset": {
          "root": "G",
          "scale": "major_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "木",
        "title": "即興の「始まり」と「終わり」",
        "minutes": 40,
        "goal": "4小節で始まりと終わりをルートで揃える。",
        "steps": [],
        "preset": {
          "root": "E",
          "scale": "minor_pent",
          "showDegrees": true,
          "showAllNotes": false
        }
      },
      {
        "dow": "金",
        "title": "録音ベスト3から1つ選ぶ",
        "minutes": 35,
        "goal": "なぜ良いか一文で分析。",
        "steps": []
      },
      {
        "dow": "土",
        "title": "自分専用「来週からの1日30分」表を作る",
        "minutes": 45,
        "goal": "紙またはメモアプリに表形式で。",
        "steps": [
          "ウォームアップ5分／スケール10分／リズム10分／振り返り5分の型を推奨。"
        ]
      },
      {
        "dow": "日",
        "title": "祝杯と休息",
        "minutes": 20,
        "goal": "8週間完走を記録。次の目標を1つだけ書く。",
        "steps": []
      }
    ]
  }
];

  function presetLabel(p) {
    if (!p) return "";
    var scaleNames = {
      major: "メジャー",
      natural_minor: "ナチュラル・マイナー",
      major_pent: "メジャー・ペンタ",
      minor_pent: "マイナー・ペンタ",
      blues: "ブルース",
      dorian: "ドリアン",
      mixolydian: "ミクソリディアン",
    };
    var sn = scaleNames[p.scale] || p.scale;
    return p.root + "／" + sn;
  }

  function applyPreset(p) {
    if (!window.BassLab || typeof window.BassLab.applyFretboardSettings !== "function") return;
    window.BassLab.applyFretboardSettings({
      root: p.root,
      scale: p.scale,
      showDegrees: p.showDegrees,
      showAllNotes: p.showAllNotes,
    });
    if (typeof window.BassLab.scrollToFretboard === "function") {
      window.BassLab.scrollToFretboard();
    }
  }

  function renderWeeks() {
    var root = document.getElementById("practice-weeks-root");
    if (!root) return;

    root.innerHTML = "";

    WEEKS.forEach(function (week) {
      var article = document.createElement("article");
      article.className = "week-block";
      article.id = "week-" + week.n;

      var wh = document.createElement("h3");
      wh.className = "week-title";
      wh.textContent = week.title;
      article.appendChild(wh);

      var ws = document.createElement("p");
      ws.className = "week-summary";
      ws.textContent = week.summary;
      article.appendChild(ws);

      var daysWrap = document.createElement("div");
      daysWrap.className = "week-days";

      week.days.forEach(function (d, idx) {
        var details = document.createElement("details");
        details.className = "day-plan";
        if (week.n === 1 && idx === 0) details.open = true;

        var sum = document.createElement("summary");
        sum.className = "day-summary";
        sum.textContent =
          "第" + week.n + "週 " + d.dow + "曜 — " + d.title + "（約" + d.minutes + "分）";
        details.appendChild(sum);

        var body = document.createElement("div");
        body.className = "day-body";

        var goal = document.createElement("p");
        goal.className = "day-goal";
        goal.innerHTML = "<strong>今日のゴール：</strong>" + d.goal;
        body.appendChild(goal);

        var ol = document.createElement("ol");
        ol.className = "day-steps";
        var steps = d.steps && d.steps.length
          ? d.steps
          : [
              "この日のテーマに沿って、実機または指板ラボで時間の大半を使う。終わりに一行メモを残す。",
            ];
        steps.forEach(function (step) {
          var li = document.createElement("li");
          li.textContent = step;
          ol.appendChild(li);
        });
        body.appendChild(ol);

        if (d.preset) {
          var actions = document.createElement("div");
          actions.className = "day-actions";
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn-lesson";
          btn.textContent = "この内容で指板を表示（" + presetLabel(d.preset) + "）";
          btn.addEventListener("click", function () {
            applyPreset(d.preset);
          });
          actions.appendChild(btn);
          var hint = document.createElement("p");
          hint.className = "day-actions-hint";
          hint.textContent =
            "ルート・音階・表示オプションが下の「指板の設定」に反映され、指板へスクロールします。";
          actions.appendChild(hint);
          body.appendChild(actions);
        }

        details.appendChild(body);
        daysWrap.appendChild(details);
      });

      article.appendChild(daysWrap);
      root.appendChild(article);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderWeeks);
  } else {
    renderWeeks();
  }
})();
