package com.example.gamecatalog;

// Виджет в виде поля ввода «Найти игру…»: нажатие открывает поиск с клавиатурой
public class QuickAddInputWidget extends QuickAddWidget {
    @Override
    protected int layoutId() { return R.layout.widget_input; }
}
