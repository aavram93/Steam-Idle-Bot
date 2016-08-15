using System;
using System.Collections.Generic;
using System.Linq;
using EloBuddy;
using EloBuddy.SDK;
using EloBuddy.SDK.Enumerations;
using Mario_s_Lib;
using static RaINAIO.TeemoMenus;

namespace RaINAIO
{
    public static class TeemoSpellsManager
    {
        /*
        Targeted spells are like Katarina`s Q
        Active spells are like Katarina`s W
        Skillshots are like Ezreal`s Q
        Circular Skillshots are like Lux`s E and Tristana`s W
        Cone Skillshots are like Annie`s W and ChoGath`s W
        */

        //Remenber of putting the correct type of the spell here
        public static Spell.Targeted Q;
        public static Spell.Active W;
        public static Spell.Active E;
        public static Spell.Skillshot R;

        public static List<Spell.SpellBase> SpellList = new List<Spell.SpellBase>();

        /// <summary>
        /// It sets the values to the spells
        /// </summary>
        public static void InitializeSpells()
        {
            Q = new Spell.Targeted(SpellSlot.Q, 680);
            W = new Spell.Active(SpellSlot.W, 20);
            E = new Spell.Active(SpellSlot.E, 680);
            R = SpellSlot.R.GetSkillShotData(SkillShotType.Circular);

            SpellList.Add(Q);
            SpellList.Add(W);
            SpellList.Add(E);
            SpellList.Add(R);

            Obj_AI_Base.OnLevelUp += Obj_AI_Base_OnLevelUp;
        }

        #region Damages

        /// <summary>
        /// It will return the damage but you need to set them before getting the damage
        /// </summary>
        /// <param name="target"></param>
        /// <param name="slot"></param>
        /// <returns></returns>
        public static float GetDamage(this Obj_AI_Base target, SpellSlot slot)
        {
            const DamageType damageType = DamageType.Magical;
            var AD = Player.Instance.FlatPhysicalDamageMod;
            var AP = Player.Instance.FlatMagicDamageMod;
            var sLevel = Player.GetSpell(slot).Level - 1;

            //You can get the damage information easily on wikia

            var dmg = 0f;

            switch (slot)
            {
                case SpellSlot.Q:
                    if (Q.IsReady())
                    {
                        //Information of Q damage
                        dmg += new float[] { 80, 125, 170, 215, 260 }[sLevel] + 0.80f * AP;
                    }
                    break;
                case SpellSlot.W:
                    if (W.IsReady())
                    {
                        //Information of W damage
                        dmg += new float[] { 0, 0, 0, 0, 0 }[sLevel] + 0.0f * AP;
                    }
                    break;
                case SpellSlot.E:
                    if (E.IsReady())
                    {
                        //Information of E damage
                        dmg += new float[] { 10, 20, 30, 40, 50 }[sLevel] + 0.30f * AP;
                    }
                    break;
                case SpellSlot.R:
                    if (R.IsReady())
                    {
                        //Information of R damage
                        dmg += new float[] { 0, 0, 0 }[sLevel]+ 0.0f * AP;
                    }
                    break;
            }
            return Player.Instance.CalculateDamageOnUnit(target, damageType, dmg - 10);
        }

        #endregion Damages

        /// <summary>
        /// This event is triggered when a unit levels up
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        private static void Obj_AI_Base_OnLevelUp(Obj_AI_Base sender, Obj_AI_BaseLevelUpEventArgs args)
        {
            if (MiscMenu.GetCheckBoxValue("activateAutoLVL") && sender.IsMe)
            {
                var delay = MiscMenu.GetSliderValue("delaySlider");
                Core.DelayAction(LevelUPSpells, delay);

            }
        }

        /// <summary>
        /// It will level up the spell using the values of the comboboxes on the menu as a priority
        /// </summary>
        private static void LevelUPSpells()
        {
            if (Player.Instance.Spellbook.CanSpellBeUpgraded(SpellSlot.R))
            {
                Player.Instance.Spellbook.LevelSpell(SpellSlot.R);
            }

            var firstFocusSlot = GetSlotFromComboBox(MiscMenu.GetComboBoxValue("firstFocus"));
            var secondFocusSlot = GetSlotFromComboBox(MiscMenu.GetComboBoxValue("secondFocus"));
            var thirdFocusSlot = GetSlotFromComboBox(MiscMenu.GetComboBoxValue("thirdFocus"));

            var secondSpell = Player.GetSpell(secondFocusSlot);
            var thirdSpell = Player.GetSpell(thirdFocusSlot);

            if (Player.Instance.Spellbook.CanSpellBeUpgraded(firstFocusSlot))
            {
                if (!secondSpell.IsLearned)
                {
                    Player.Instance.Spellbook.LevelSpell(secondFocusSlot);
                }
                if (!thirdSpell.IsLearned)
                {
                    Player.Instance.Spellbook.LevelSpell(thirdFocusSlot);
                }
                Player.Instance.Spellbook.LevelSpell(firstFocusSlot);
            }

            if (Player.Instance.Spellbook.CanSpellBeUpgraded(secondFocusSlot))
            {
                if (!thirdSpell.IsLearned)
                {
                    Player.Instance.Spellbook.LevelSpell(thirdFocusSlot);
                }
                Player.Instance.Spellbook.LevelSpell(firstFocusSlot);
                Player.Instance.Spellbook.LevelSpell(secondFocusSlot);
            }

            if (Player.Instance.Spellbook.CanSpellBeUpgraded(thirdFocusSlot))
            {
                Player.Instance.Spellbook.LevelSpell(thirdFocusSlot);
            }
        }

        /// <summary>
        /// It will transform the value of the combobox into a SpellSlot
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private static SpellSlot GetSlotFromComboBox(this int value)
        {
            switch (value)
            {
                case 0:
                    return SpellSlot.Q;
                case 1:
                    return SpellSlot.W;
                case 2:
                    return SpellSlot.E;
            }
            Chat.Print("Failed getting slot");
            return SpellSlot.Unknown;
        }
    }
}