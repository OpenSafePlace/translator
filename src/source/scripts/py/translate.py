import argostranslate.translate
import argostranslate.package
import sys


def package_install(dataFrom, dataTo):
    argostranslate.package.update_package_index()

    packages_available = argostranslate.package.get_available_packages()
    packages = list(filter(lambda x: x.from_code ==
                    dataFrom and x.to_code == dataTo, packages_available))

    if len(packages) != 0:
        package = packages[0]

        argostranslate.package.install_from_path(package.download())

        return True
    else:
        return False


def text_translate(dataFrom, dataTo, text):
    return argostranslate.translate.translate(text, dataFrom, dataTo)


def api():
    action = sys.argv[1]

    if action == 'package-install':
        dataFrom = sys.argv[2]
        dataTo = sys.argv[3]

        if package_install(dataFrom, dataTo):
            return "Языковой пакет установлен"
        else:
            return "Ошибка установки языкового пакета, возможно его на данный момент не существует :("

    if action == 'text-translate':
        dataFrom = sys.argv[2]
        dataTo = sys.argv[3]
        text = sys.argv[4]
        packages_installed = argostranslate.translate.package.get_installed_packages()
        packages = list(filter(lambda x: x.from_code ==
                        dataFrom and x.to_code == dataTo, packages_installed))

        if len(packages) != 0:
            return text_translate(dataFrom, dataTo, text)
        else:
            if package_install(dataFrom, dataTo):
                return text_translate(dataFrom, dataTo, text)
            else:
                return "Ошибка установки языкового пакета, возможно его на данный момент не существует :("


print(api())
