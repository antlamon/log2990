from datetime import *

DEV = "DEV"
DEBUG = "DEBUG"
REFACTOR = "REFACTOR"
TEST = "TEST"
OTHER = "OTHER"
NONE = "NONE"


# Sprints pour la section 1
# sprints = {
#     1: {"begin": date(2019, 1, 1), "end": date(2019, 2, 3)},
#     2: {"begin": date(2019, 2, 4), "end": date(2019, 2, 24)},
#     3: {"begin": date(2019, 2, 25), "end": date(2019, 3, 24)},
#     4: {"begin": date(2019, 3, 24), "end": date(2019, 4, 14)}
# }

# Sprints pour la section 2
sprints = {
    1: {"begin": date(2019, 1, 1), "end": date(2019, 2, 5)},
    2: {"begin": date(2019, 2, 6), "end": date(2019, 2, 26)},
    3: {"begin": date(2019, 2, 27), "end": date(2019, 3, 26)},
    4: {"begin": date(2019, 3, 27), "end": date(2019, 4, 16)}
}



config = {
    # Les codes utilisé dans les messages de commit pour spécifier la tâche
    'task_code':{
        'dev': ["[D]","(D)","D", "Dev", "d", "dev", "[Dev]", "[D][AR]", "[D]SM-"],
        'debug': ["[B]","(B)","B", "[fix]", "[Fix]"],
        'test': ["[T]","(T)","T", "t", "[T][AR]", "test", "[Tests]"],
        'refactor': ["[R]","(R)","R"],
        'other': ["[A]","(A)","A", "UX", "[L]", "[styling]"],
        'QA': ["[QA]", "QA" , "[qa]"]
    },

    # Seulement les commits compris dans la période de temps indiqués apparaîtront
    # Si la clé "begin" est absente, il n'y aura aucune limite inférieure
    # Si la clé "end" est absente, il n'y aura aucune limite supérieure
    'period':{
        #'begin': date(2019,2,1),
        'end': date.today()
    },

    # Seulement les commits des auteurs dont le courriel est spécifié apparaîtront
    # Si la clé est absente, aucun filtrage ne sera effectué
    #'authors':[
    #],

    # Seulemenet les commits des auteurs dont l'identificateur est spécifié apparaîtront
    # Si la clé est absente, aucun filtrage ne sera effectué
    # 'authors_id':[],

    # Seulement les commits des tâches spéficiées apparaîtront
    # Si la clé est absente, aucun filtrage ne sera effectué
    #'tasks': [DEV,DEBUG],


    # Pour déterminer si les commits de fusion de branches seront affichés
    'merge': False,

    # Pour identifier les id de commmits qu'on ne veut pas voir apparaître
    'forget': [
    ]


}
