<?$ver = '12'?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Custom elements</title>
</head>
<body>
    <app-body>
        <custom-form action="#" method="get">
            <form>
                <div>
                    <custom-select placeholder="Выберите категорию" options='<?=json_encode([
                        [
                            'name' => 'twelve',
                            'value' => 12
                        ],
                        [
                            'name' => 'thirteen',
                            'value' => 13
                        ],
                        [
                            'name' => 'fourteen',
                            'value' => 14
                        ]
                    ])?>'>
                        <input name="foo" type="number" value=12 max="100">
                    </custom-select>
                </div>
                <div>
                    <custom-text-input>
                        <input name="doo" value=65 placeholder="Введите текст" pattern="\d{4}" required>
                    </custom-text-input>
                </div>
                <input type="submit" value="Save">
            </form>
        </custom-form>
    </app-body>
    <script src="/app-body/script.js?<?=$ver?>"></script>
    <script src="/custom-select/script.js?<?=$ver?>"></script>
    <script src="/custom-text/script.js?<?=$ver?>"></script>
    <script src="/custom-form/script.js?<?=$ver?>"></script>
</body>
</html>